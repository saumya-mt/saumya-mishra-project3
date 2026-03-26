import React from "react";
import { useAuth } from "../context/AuthContext";
import { useSudoku } from "../context/SudokuContext";

function SudokuCell({
  row,
  col,
  value,
  isFixed,
  isInvalid,
  isSelected,
  isHinted,
  rowGroupSize,
  colGroupSize,
  size,
}) {
  const { isLoggedIn } = useAuth();
  const { dispatch, state } = useSudoku();
  const isReadOnly = !isLoggedIn || isFixed || state.isComplete;

  const classes = ["cell"];
  if (isFixed) classes.push("fixed");
  if (isInvalid) classes.push("invalid");
  if (isSelected) classes.push("selected");
  if (isHinted) classes.push("hint");
  if ((col + 1) % colGroupSize === 0 && col !== size - 1) classes.push("thick-right");
  if ((row + 1) % rowGroupSize === 0 && row !== size - 1) classes.push("thick-bottom");

  return (
    <input
      value={value ?? ""}
      readOnly={isReadOnly}
      className={classes.join(" ")}
      onFocus={() => {
        if (isLoggedIn) {
          dispatch({ type: "SELECT_CELL", payload: { row, col } });
        }
      }}
      onClick={() => {
        if (isLoggedIn) {
          dispatch({ type: "SELECT_CELL", payload: { row, col } });
        }
      }}
      onChange={(event) =>
        dispatch({
          type: "SET_CELL_VALUE",
          payload: { row, col, rawValue: event.target.value },
        })
      }
      inputMode="numeric"
      maxLength={1}
      aria-label={`Cell ${row + 1}-${col + 1}`}
    />
  );
}

export default SudokuCell;
