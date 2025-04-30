import express from "express"
import { createServer } from "http";
import{Server } from "socket.io"
import dotenv from "dotenv"
import Redis from "ioredis";
import CookieParser from "cookie-parser"
import cors from "cors"
import logger from "./utils/logger";
import { SocketHandler } from "./type";

dotenv.config()

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors:{
    origin : process.env.ORIGIN,
    methods:["POST", 'GET'],
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
// todo 



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




ShowSocket.on("connect", (socket)=>{
    console.log(`Shows socket is being connected ${socket.id}`)
})


import { UserRouter } from "./routes/user.routes";
import { MovieRouter } from "./routes/movie.routes";
import { AdminRouter } from "./routes/admin.routes";
import { ShowRouter } from "./routes/show.routes";

app.use("/users", UserRouter)
app.use("/movies", MovieRouter)
app.use("/admin", AdminRouter)
app.use("/shows", ShowRouter)

import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { ONLINE_USERS } from "./constants/constants";
import { createSeats } from "./db/data/creatSeats";
import { CreateScreens } from "./db/data/createscreens";
import { InsertMovies } from "./db/data/movies";




// creating the dummy datas 
// createSeats()
// CreateScreens()
// InsertMovies()

app.use(ErrorMiddleware)


export {httpServer , RedisClient}