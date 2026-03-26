import React from "react";
import { useSudoku } from "../context/SudokuContext";

function GameControls({ mode }) {
  const { dispatch, state } = useSudoku();

  return (
    <div className="game-controls">
      <button type="button" onClick={() => dispatch({ type: "START_NEW_GAME", payload: { mode } })}>
        New Game
      </button>
      <button type="button" onClick={() => dispatch({ type: "RESET_GAME" })}>
        Reset
      </button>
      <button type="button" onClick={() => dispatch({ type: "SHOW_HINT" })}>
        Hint
      </button>
      {state.isComplete && <p className="win-message">Congratulations! Puzzle solved.</p>}
    </div>
  );
}

export default GameControls;
