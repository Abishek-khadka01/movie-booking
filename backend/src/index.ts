import express from "express"
import { createServer } from "http";
import{Server } from "socket.io"
import dotenv from "dotenv"
import Redis from "ioredis";
import CookieParser from "cookie-parser"
import cors from "cors"
import logger from "./utils/logger";
import { ShowSocketType, SocketHandler } from "./type";
import { ONLINE_USERS, SEATS_RESERVATION_ONGOING, SEND_MESSAGE_QUEUE, SHOW_CREATED_MESSAGE } from "./constants/constants";
import { REMOVE_SELECTED_SEAT_FOR_REGISTER, SELECT_SEATS_FOR_REGISTER , UPDATED_SEATS} from "./constants/sockets/socket.constants";
import { ConnectBroker } from "./queue/producer";
dotenv.config()

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors:{
    origin : process.env.ORIGIN,
    methods:["POST", 'GET', 'PUT', 'PATCH'],
    credentials : true
} });
app.use(express.json())
app.use(express.urlencoded())
app.use(CookieParser())
app.use(cors({
    origin : process.env.ORIGIN,
    methods :['POST', 'GET' , 'PUT ', 'PATCH'],
    credentials : true
    
}))

console.log(process.env.ORIGIN)
 

// connect to database 
import { ConnectToDatabase } from "./db/connectDb";
ConnectToDatabase()

// connecting to redis 

const RedisClient = new Redis({
    host :"localhost",
    port : 6379,

})



RedisClient.on("connect", ()=>{
    logger.info(`Redis is connected successfully `)
})


RedisClient.on("error", (error)=>{
    logger.error(`Error in connecting to the redis ${error.message}`)
})

// map to set the online users for the notification 
const MapUserIdToSocket = new Map<string, string >()
const MapSocketToUserId = new Map<string, string>()


// map to keep the record of the selected seat and by which user 

  const MapSelectedSeatToUserId = new Map<string, string >()
// the show seats are unique id so  


const NotificationSocket = io.of("/notifications")

// the socket to show the seats availability and registered seats 



const ShowSocket  = io.of("/shows")



NotificationSocket.use((socket : SocketHandler, next)=>{
    const userId = socket.handshake.auth.userId
    if(!userId){
        next (new Error(`UserId should be provided `))
    }


       socket.userId = userId
       next()

})

NotificationSocket.on("connection", async (socket: SocketHandler) => {
    const userid = socket.userId;
    console.log(`Notification Socket is connected ${socket.id} ${userid}`);

    try {
        const OnlineUserRedis = await RedisClient.lrange(ONLINE_USERS, 0, -1);
        MapUserIdToSocket.set(userid as string , socket.id)
        MapSocketToUserId.set(socket.id , userid as string )

        if (!OnlineUserRedis.includes(userid as string)) {
            await RedisClient.lpush(ONLINE_USERS, userid as string);
            
        }
    } catch (err) {
        console.error("Error while adding user to online list:", err);
    }

    socket.on("disconnect", async () => {
        try {
            logger.warn(`User with ${socket.id} is disconnected`);
            await RedisClient.lrem(ONLINE_USERS, 0, userid as string); // 0 means remove all occurrences
            MapSocketToUserId.delete(socket.id)
            MapUserIdToSocket.delete(userid as string )
        } catch (err) {
            console.error("Error while removing user from online list:", err);
        }
    });
});


ShowSocket.use(async (socket : ShowSocketType, next)=>{
    const {userId , showId} = socket.handshake.auth


        if(!userId || !showId){
            logger.warn(`No userid or showid received  ${userId} ${showId}`)
            next (new Error(`Error in getting the userid or showid `))
        }

        // checking if the userid and showid are valid or not
        const user = await User.findById(userId)         
        const show = await Show.findById(showId)

        if(!user || !show){
            next (new Error(`The show or user doesnot exist `))
        }

        socket.userId = userId
        socket.showID = showId
        next()

})


ShowSocket.on("connect", (socket : ShowSocketType)=>{
    logger.info(`Shows socket is connected ${socket.id}`)

    socket.on(SELECT_SEATS_FOR_REGISTER, async (data: any) => {
        const { seatId } = data;
        console.log(seatId)
        logger.info(`Select seats for register is provoked`);
    
        try {
          
             const addResult = await RedisClient.sadd(`${SEATS_RESERVATION_ONGOING}:${socket.showID}`, seatId as string);
             console.log(addResult) // 1 means added successfully 
    
            
            MapSelectedSeatToUserId.set(seatId, socket.userId as string);
    
           
            const updatedSeats = await RedisClient.smembers(`${SEATS_RESERVATION_ONGOING}:${socket.showID}`);
    
            logger.warn(`The updated seats are ${updatedSeats}`)
            socket.broadcast.emit(UPDATED_SEATS, {
                showid: socket.showID,
                updatedSeats: updatedSeats
            });
        } catch (error) {
            logger.error('Error during seat selection process', error);
          
        }


        socket.on(REMOVE_SELECTED_SEAT_FOR_REGISTER , async(data)=>{
            try {

        const {seatId }  = data
      
            await RedisClient.srem(`${SEATS_RESERVATION_ONGOING}:${socket.showID}`, seatId as string);        
            MapSelectedSeatToUserId.delete(seatId);
                      
           
            const updatedSeats = await RedisClient.smembers(`${SEATS_RESERVATION_ONGOING}:${socket.showID}`);
    
            logger.warn(`The updated seats are ${updatedSeats}`)
            socket.broadcast.emit(UPDATED_SEATS, {
                showid: socket.showID,
                updatedSeats: updatedSeats
            });

            } catch (error) {
                logger.error(`Error in removing the seats ${error}`)
            }


        })
    });
    

})



const Queue =  ConnectBroker()
Queue.then((queue) => {
    queue.consume(SHOW_CREATED_MESSAGE, async (message: any) => {
      if (message !== null) {
        try {
          const parsedMessage = JSON.parse(message.content.toString());
          
          logger.warn('The details are received');
  
          await SendNotification(parsedMessage);
  
          
          queue.ack(message);
        } catch (error) {
          logger.error('Failed to process message:', error);
          
        }
      }
    });


    queue.consume(SEND_MESSAGE_QUEUE, async(message : any)=>{
        if (message !== null) {
            try {
              const parsedMessage = JSON.parse(message.content.toString());
                console.table(parsedMessage)
              logger.warn(`The details are received ${parsedMessage} `);
      
              await SendMessageandNotifications(parsedMessage)
            } catch (error) {
              logger.error('Failed to process message:', error);
              
            }
          }
    })
  });
  




import { UserRouter } from "./routes/user.routes";
import { MovieRouter } from "./routes/movie.routes";
import { AdminRouter } from "./routes/admin.routes";
import { ShowRouter } from "./routes/show.routes";
import { PaymentRouter } from "./routes/payment.routes";

app.use("/users", UserRouter)
app.use("/movies", MovieRouter)
app.use("/admin", AdminRouter)
app.use("/shows", ShowRouter)
app.use("/payment", PaymentRouter)


import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { createSeats } from "./db/data/creatSeats";
import { CreateScreens } from "./db/data/createscreens";
import { InsertMovies } from "./db/data/movies";
import { User } from "./models/user.models";
import { Show } from "./models/show.models";
import { SendNotification, NotificationPayload, SendMessageandNotifications } from "./queue/consumer";






// creating the dummy datas 
// createSeats()
// CreateScreens()
// InsertMovies()

app.use(ErrorMiddleware)


export {httpServer , RedisClient , MapSelectedSeatToUserId , MapSocketToUserId , MapUserIdToSocket , NotificationSocket, Queue}



// todo 

/*
     add the payment methofs 
     the selected user can remove the seatid after reloading the page too 
     



*/ 