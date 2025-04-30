// models/Seat.js
import mongoose from "mongoose"

const seatSchema = new mongoose.Schema({
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  seatNumber: { type: String, required: true }, // like A1, A2
  type: { 
    type: String, 
    enum: ['REGULAR', 'PREMIUM', 'VIP'], 
    required: true 
  },
}, { timestamps: true });

export const Seat = mongoose.model('Seat', seatSchema);
