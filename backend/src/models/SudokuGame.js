import mongoose from "mongoose";

const sudokuGameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "NORMAL", "CUSTOM"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["easy", "normal"],
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    rowGroupSize: {
      type: Number,
      required: true,
    },
    colGroupSize: {
      type: Number,
      required: true,
    },
    puzzle: {
      type: [[Number]],
      required: true,
    },
    solution: {
      type: [[Number]],
      required: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SudokuGame", sudokuGameSchema);
