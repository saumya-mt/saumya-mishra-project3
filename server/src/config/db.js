import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

let connectionPromise;

export default function connectToDatabase() {
  if (!connectionPromise) {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sudoku_project3";
    connectionPromise = mongoose.connect(mongoUri);
  }

  return connectionPromise;
}
