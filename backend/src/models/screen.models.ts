// models/Screen.js
import mongoose from "mongoose"
const screenSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Screen 1", "Screen 2"
}, { timestamps: true });

export const Screen = mongoose.model('Screen', screenSchema);
