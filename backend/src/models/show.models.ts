import mongoose from "mongoose"


const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: 'Screen', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
    seats :[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"ShowSeat"
    }]
}, { timestamps: true });

export const Show  = mongoose.model('Show', showSchema);
