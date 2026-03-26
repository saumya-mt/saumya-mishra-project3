import mongoose from "mongoose";

const gameProgressSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SudokuGame",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    board: {
      type: [[Number]],
      required: true,
    },
    secondsElapsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

gameProgressSchema.index({ game: 1, user: 1 }, { unique: true });

export default mongoose.model("GameProgress", gameProgressSchema);
