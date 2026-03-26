import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { buildPuzzle, evaluateBoard, getCandidates } from "../utils/sudoku";

const SudokuContext = createContext(null);
const STORAGE_KEY = "sudoku-project2-state";

function createFixedCells(puzzle) {
  return puzzle.map((row) => row.map((value) => value !== null));
}

function createGameState(mode) {
  const generated = buildPuzzle(mode);
  const fixedCells = createFixedCells(generated.puzzle);

  return {
    mode: generated.mode,
    size: generated.size,
    rowGroupSize: generated.rowGroupSize,
    colGroupSize: generated.colGroupSize,
    solution: generated.solution,
    initialBoard: generated.puzzle,
    board: generated.puzzle.map((row) => [...row]),
    fixedCells,
    invalidCells: evaluateBoard(generated.puzzle, fixedCells, generated.rowGroupSize, generated.colGroupSize),
    selectedCell: null,
    hintCell: null,
    isComplete: false,
    secondsElapsed: 0,
  };
}

function createGameStateFromRecord(game) {
  const fixedCells = createFixedCells(game.initialPuzzle);

  return {
    gameId: game.id,
    gameName: game.name,
    creatorId: game.creatorId,
    creatorUsername: game.creatorUsername,
    isOwner: Boolean(game.isOwner),
    mode: game.mode,
    size: game.size,
    rowGroupSize: game.rowGroupSize,
    colGroupSize: game.colGroupSize,
    solution: game.solution,
    initialBoard: game.initialPuzzle,
    board: game.board.map((row) => [...row]),
    fixedCells,
    invalidCells: evaluateBoard(game.board, fixedCells, game.rowGroupSize, game.colGroupSize),
    selectedCell: null,
    hintCell: null,
    isComplete: Boolean(game.completed),
    secondsElapsed: game.secondsElapsed || 0,
  };
}

function isSolved(board, solution) {
  return board.every((row, rowIndex) =>
    row.every((value, colIndex) => value === solution[rowIndex][colIndex])
  );
}

function getSavedState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (
      !parsed ||
      !parsed.mode ||
      typeof parsed.size !== "number" ||
      typeof parsed.rowGroupSize !== "number" ||
      typeof parsed.colGroupSize !== "number" ||
      !Array.isArray(parsed.board) ||
      !Array.isArray(parsed.initialBoard) ||
      !Array.isArray(parsed.solution) ||
      !Array.isArray(parsed.fixedCells) ||
      !Array.isArray(parsed.invalidCells)
    ) {
      return null;
    }

    if (parsed.board.length !== parsed.size || parsed.solution.length !== parsed.size) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function clearSavedState() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "START_NEW_GAME": {
      return createGameState(action.payload.mode);
    }

    case "LOAD_GAME": {
      return createGameStateFromRecord(action.payload.game);
    }

    case "RESET_GAME": {
      return {
        ...state,
        board: state.initialBoard.map((row) => [...row]),
        invalidCells: evaluateBoard(state.initialBoard, state.fixedCells, state.rowGroupSize, state.colGroupSize),
        selectedCell: null,
        hintCell: null,
        isComplete: false,
        secondsElapsed: 0,
      };
    }

    case "SELECT_CELL": {
      if (state.isComplete) {
        return state;
      }
      return {
        ...state,
        selectedCell: action.payload,
      };
    }

    case "SET_CELL_VALUE": {
      const { row, col, rawValue } = action.payload;
      if (state.isComplete || state.fixedCells[row][col]) {
        return state;
      }

      const trimmedValue = rawValue.trim();
      let nextValue = null;

      if (trimmedValue !== "") {
        if (!/^\d+$/.test(trimmedValue)) {
          return state;
        }

        const parsed = Number(trimmedValue);
        if (parsed < 1 || parsed > state.size) {
          return state;
        }

        nextValue = parsed;
      }

      const updatedBoard = state.board.map((currentRow, rowIndex) =>
        currentRow.map((value, colIndex) => (rowIndex === row && colIndex === col ? nextValue : value))
      );

      const invalidCells = evaluateBoard(
        updatedBoard,
        state.fixedCells,
        state.rowGroupSize,
        state.colGroupSize
      );
      const hasInvalidCells = invalidCells.some((rowValues) => rowValues.some(Boolean));
      const complete = !hasInvalidCells && isSolved(updatedBoard, state.solution);

      return {
        ...state,
        board: updatedBoard,
        invalidCells,
        hintCell: null,
        isComplete: complete,
      };
    }

    case "SHOW_HINT": {
      if (state.isComplete) {
        return state;
      }

      for (let row = 0; row < state.size; row += 1) {
        for (let col = 0; col < state.size; col += 1) {
          if (state.fixedCells[row][col] || state.board[row][col] !== null) {
            continue;
          }

          const candidates = getCandidates(
            state.board,
            row,
            col,
            state.size,
            state.rowGroupSize,
            state.colGroupSize
          );

          if (candidates.length === 1) {
            return {
              ...state,
              selectedCell: { row, col },
              hintCell: { row, col },
            };
          }
        }
      }

      return {
        ...state,
        hintCell: null,
      };
    }

    case "TICK_TIMER": {
      if (state.isComplete) {
        return state;
      }
      return {
        ...state,
        secondsElapsed: state.secondsElapsed + 1,
      };
    }

    default:
      return state;
  }
}

export function SudokuProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      return getSavedState() || createGameState("easy");
    } catch {
      clearSavedState();
      return createGameState("easy");
    }
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch({ type: "TICK_TIMER" });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (state.isComplete) {
      clearSavedState();
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const dispatchAction = useCallback((action) => {
    if (action.type === "RESET_GAME" || action.type === "LOAD_GAME") {
      clearSavedState();
    }
    dispatch(action);
  }, [dispatch]);

  return <SudokuContext.Provider value={{ state, dispatch: dispatchAction }}>{children}</SudokuContext.Provider>;
}

export function useSudoku() {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error("useSudoku must be used inside SudokuProvider");
  }
  return context;
}
