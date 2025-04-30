import mongoose from "mongoose";
import { Seat } from "../../models/Seat.models";
import { ShowSeat } from "../../models/show_seat.models";
import { Show } from "../../models/show.models";
import { Screen } from "../../models/screen.models";
import { Document } from "mongoose";
 export const CreateShowSeats = async (showId: mongoose.Types.ObjectId, screenname : string ) => {
  const findScreen : Document| null  = await Screen.findOne({
    name : screenname
  })  as Document
  const seats = await Seat.find({
    screen : findScreen?._id 
  }).select("_id");

  const showSeatData = seats.map((seat) => ({
    seatNumber: seat._id,
    price: 500,
    show: showId,
  }));

  const createdShowSeats = await ShowSeat.insertMany(showSeatData); 

  const findShow = await Show.findById(showId);
  if (!findShow) {
    throw new Error("Show not found");
  }

  const showSeatIds = createdShowSeats.map((showSeat) => showSeat._id);
  findShow.seats.push(...showSeatIds);

  await findShow.save();
};
