import React from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { postJson } from "../lib/api";
import { createEmptyBoard, evaluateBoard } from "../utils/sudoku";

const SIZE = 9;
const ROW_GROUP_SIZE = 3;
const COL_GROUP_SIZE = 3;

function CustomGamePage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [board, setBoard] = useState(() => createEmptyBoard(SIZE));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fixedCells = useMemo(
    () => board.map((row) => row.map(() => false)),
    [board]
  );
  const invalidCells = useMemo(
    () => evaluateBoard(board, fixedCells, ROW_GROUP_SIZE, COL_GROUP_SIZE),
    [board, fixedCells]
  );

  function handleCellChange(row, col, rawValue) {
    const trimmedValue = rawValue.trim();

    if (trimmedValue !== "" && !/^[1-9]$/.test(trimmedValue)) {
      return;
    }

    setBoard((current) =>
      current.map((currentRow, rowIndex) =>
        currentRow.map((value, colIndex) => {
          if (rowIndex !== row || colIndex !== col) {
            return value;
          }

          return trimmedValue === "" ? null : Number(trimmedValue);
        })
      )
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      const result = await postJson("/api/sudoku/custom", { puzzle: board });
      navigate(`/game/${result.gameId}`);
    } catch (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
    }
  }

  function handleClear() {
    setBoard(createEmptyBoard(SIZE));
    setErrorMessage("");
  }

  return (
    <section className="page card game-page">
      <h1>Create Custom Game</h1>
      <p>
        Build a 9x9 Sudoku puzzle and submit it. The backend will only accept it if it has exactly one valid solution.
      </p>
      {!isLoggedIn ? <p>You need to log in before submitting a custom puzzle.</p> : null}
      <form className="custom-game-form" onSubmit={handleSubmit}>
        <div
          className="sudoku-grid custom-grid"
          style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
        >
          {board.map((rowValues, row) =>
            rowValues.map((value, col) => {
              const classes = ["cell", "custom-cell"];
              if (invalidCells[row][col]) classes.push("invalid");
              if ((col + 1) % COL_GROUP_SIZE === 0 && col !== SIZE - 1) classes.push("thick-right");
              if ((row + 1) % ROW_GROUP_SIZE === 0 && row !== SIZE - 1) classes.push("thick-bottom");

              return (
                <input
                  key={`${row}-${col}`}
                  className={classes.join(" ")}
                  value={value ?? ""}
                  onChange={(event) => handleCellChange(row, col, event.target.value)}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Custom cell ${row + 1}-${col + 1}`}
                />
              );
            })
          )}
        </div>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <div className="game-controls">
          <button type="submit" disabled={!isLoggedIn || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button type="button" onClick={handleClear} disabled={isSubmitting}>
            Clear Board
          </button>
        </div>
      </form>
    </section>
  );
}

export default CustomGamePage;
