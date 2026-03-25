import React from "react";
import { useEffect } from "react";
import { useSudoku } from "../context/SudokuContext";
import GameControls from "./GameControls";
import GameHeader from "./GameHeader";
import SudokuBoard from "./SudokuBoard";

function GamePageLayout({ mode, title }) {
  const { dispatch } = useSudoku();

  useEffect(() => {
    dispatch({ type: "START_NEW_GAME", payload: { mode } });
  }, [dispatch, mode]);

  return (
    <section className="page card game-page">
      <GameHeader title={title} />
      <SudokuBoard />
      <GameControls mode={mode} />
    </section>
  );
}

export default GamePageLayout;
