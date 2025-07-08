import { RedisClient } from "..";
import logger from "../utils/logger";
import { MapUserIdToSocket } from "..";
import { ONLINE_USERS, SEND_NOTICATIONS } from "../constants/constants";
import { NotificationSocket } from "..";
import mongoose from "mongoose";
import { Booking } from "../models/booking.models";
import { Show } from "../models/show.models";
import { SendMail } from "../utils/Nodemailer";

 export interface NotificationPayload {
  _id: string | mongoose.Schema.Types.ObjectId;
  title: string;
}

const SendNotification = async ({ _id, title }: NotificationPayload) => {
  try {

      console.log("dfgjdjg", _id , title )
    const onlineUsers = await RedisClient.lrange(ONLINE_USERS, 0, -1 )
    logger.warn(`the online users are ${onlineUsers}`)

    onlineUsers.forEach((members)=>{
      NotificationSocket.to(MapUserIdToSocket.get(members as string ) as string ).emit(SEND_NOTICATIONS, {
        id : _id.toString(),
        title 
      })    

    })

    console.log(`NOtification send `)
  } catch (error) {
    logger.error(`Error in sending the notification: ${error}`);
  }
};


const SendMessageandNotifications = async ({
  transactionId,
  pidx,
}: {
  transactionId: string;
  pidx: string;
}) => {
  try {
    console.log(transactionId, pidx)
    const findBooking = await Booking.findById(transactionId).populate<{
      user: { email?: string; username?: string };
    }>({
      path: 'user',
      select: 'email username',
    });

    if (!findBooking) {
      logger.warn(`Booking not found for transaction ID: ${transactionId}`);
      return;
    }

    const findShow = await Show.findById(findBooking.show)
      .populate<{
        seats: Array<{
          seatNumber?: { seatNumber: string };
        }>;
        movie?: { title?: string };
      }>({
        path: 'seats',
        populate: {
          path: 'seatNumber',
          select: 'seatNumber',
        },
      })
      .populate({
        path: 'movie',
        select: 'title',
      })
      .select('movie startTime seats');

    if (!findShow || !findShow.movie) {
      logger.warn(`Show or movie not found for booking`);
      return;
    }

    const seatNumbers = Array.isArray(findShow.seats)
      ? findShow.seats
          .map((showSeat) => showSeat.seatNumber?.seatNumber)
          .filter(Boolean)
          .join(', ')
      : '';

    const onlineUsers = await RedisClient.lrange(ONLINE_USERS, 0, -1);
    logger.warn(`The online users are ${onlineUsers}`);

    onlineUsers.forEach((memberId) => {
      const socketId = MapUserIdToSocket.get(memberId as string);
      if (socketId) {
        NotificationSocket.to(socketId).emit(SEND_NOTICATIONS, {
          id: '',
          title: `The show "${findShow.movie?.title}" is booked for ${findShow.startTime.toLocaleDateString()} - Seats: ${seatNumbers}`,
        });
      }
    });

    console.log(`Notification sent`);

    await SendMail(
      findBooking.user?.email ?? '',
      `Show booked successfully`,
      {
        movieName: findShow.movie?.title ?? 'Unknown',
        movieTime: new Date(findShow.startTime).toLocaleTimeString(),
        movieDate: new Date(findShow.startTime).toLocaleDateString(),
        ticketPrice: findBooking.totalPrice,
        quantity: findBooking.seatNumbers.length,
        seats: seatNumbers,
        totalAmount: findBooking.totalPrice,
        
      }
    );
  } catch (error: any) {
    logger.error(`Error in sending the message and notifications: ${error.message}`);
  }
};




export  {SendNotification, SendMessageandNotifications};
