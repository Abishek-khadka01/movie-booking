import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], 
    default: 'PENDING'
  },
  method: { 
    type: String, 
    enum: ['KHALTI'], 
    required: true,
    default :"KHALTI" 
  },
  transactionId: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
