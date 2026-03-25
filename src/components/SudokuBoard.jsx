import React from "react";
import { useSudoku } from "../context/SudokuContext";
import SudokuCell from "./SudokuCell";

function SudokuBoard() {
  const { state } = useSudoku();

  return (
    <div
      className="sudoku-grid"
      style={{
        gridTemplateColumns: `repeat(${state.size}, minmax(0, 1fr))`,
      }}
    >
      {state.board.map((rowValues, row) =>
        rowValues.map((value, col) => (
          <SudokuCell
            key={`${row}-${col}`}
            row={row}
            col={col}
            value={value}
            size={state.size}
            isFixed={state.fixedCells[row][col]}
            isInvalid={state.invalidCells[row][col]}
            isSelected={state.selectedCell?.row === row && state.selectedCell?.col === col}
            isHinted={state.hintCell?.row === row && state.hintCell?.col === col}
            rowGroupSize={state.rowGroupSize}
            colGroupSize={state.colGroupSize}
          />
        ))
      )}
    </div>
  );
}

export default SudokuBoard;
