import mongoose from "mongoose";

const showSeatSchema = new mongoose.Schema({
  seatNumber: { type: mongoose.Types.ObjectId, required: true,
    ref:"Seat",

   }, 
  
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'BOOKED'], 
    default: 'AVAILABLE'
  },
  show :{
    type : mongoose.Schema.Types.ObjectId,
    ref :"Show",
    required : true
  },
  price: { type: Number, required: true }
});

export const ShowSeat  = mongoose.model("ShowSeat" , showSeatSchema); 