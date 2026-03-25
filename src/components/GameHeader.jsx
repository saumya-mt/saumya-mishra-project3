import React from "react";
import { useSudoku } from "../context/SudokuContext";

const formatSeconds = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
};

function GameHeader({ title }) {
  const { state } = useSudoku();
  return (
    <div className="game-header">
      <h1>{title}</h1>
      <p className="timer">Time: {formatSeconds(state.secondsElapsed)}</p>
    </div>
  );
}

export default GameHeader;
