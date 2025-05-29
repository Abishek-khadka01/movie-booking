import { MapUserIdToSocket, ShowSocket } from "..";
import { RedisClient } from "..";
import mongoose from "mongoose";
import { BOOKED_SEATS, ONLINE_USERS } from "../constants/constants";

export const BroadCastMessage = async (
  showid: mongoose.Types.ObjectId,
  seatNumbers: mongoose.Types.ObjectId[]
) => {
  try {
    // Fetch online users from Redis
    const onlineUsers = await RedisClient.lrange(ONLINE_USERS, 0, -1);

    // Add booked seats to Redis set
    await RedisClient.sadd(`${BOOKED_SEATS}`,{ 
        ...seatNumbers.map(s => s.toString())});

    // Broadcast to all online users
    onlineUsers.forEach((userId) => {
      const socketId = MapUserIdToSocket.get(userId);
      if (socketId) {
        ShowSocket.to(socketId).emit(`${BOOKED_SEATS}`, {
            showid,
          seatNumbers,
        });
      }
    });
  } catch (error) {
    console.error("Error broadcasting message:", error);
  }
};
