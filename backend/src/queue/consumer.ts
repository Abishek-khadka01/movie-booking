import { RedisClient } from "..";
import logger from "../utils/logger";
import { MapUserIdToSocket } from "..";
import { ONLINE_USERS, SEND_NOTICATIONS } from "../constants/constants";
import { NotificationSocket } from "..";
import mongoose from "mongoose";

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

export  {SendNotification};
