import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seatNumbers: [{ type: mongoose.Schema.Types.ObjectId,
    ref :"ShowSeat", required: true }], 
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], 
    default: 'PENDING'
  }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
