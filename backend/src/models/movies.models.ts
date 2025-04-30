import mongoose from "mongoose"
const movieSchema = new mongoose.Schema({
  title: { 
    type: String,
     required: true
     },
  description: {
     type: String,
      required: true
     },
     thumbnail :{
      type :String,
       required : true
     },

  duration: {
     type: Number,
      required: true
     },
  rating: {
     type: Number
     },
  releaseDate: {
     type: Date,
      required: true
     },
  language: {
     type: String,
      required: true
     },
  genre: [{
     type: String,
      required: true
     }],
}, {
    timestamps: true
 });

export const Movie  = mongoose.model('Movie', movieSchema);
