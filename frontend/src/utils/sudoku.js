const MODE_CONFIG = {
  easy: { mode: "easy", size: 6, rowGroupSize: 2, colGroupSize: 3, clueMin: 18, clueMax: 18 },
  normal: { mode: "normal", size: 9, rowGroupSize: 3, colGroupSize: 3, clueMin: 28, clueMax: 30 },
};

export function cloneBoard(board) {
  return board.map((row) => [...row]);
}

export function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => null));
}

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isValidPlacement(board, row, col, value, rowGroupSize, colGroupSize) {
  for (let c = 0; c < board.length; c += 1) {
    if (c !== col && board[row][c] === value) {
      return false;
    }
  }

  for (let r = 0; r < board.length; r += 1) {
    if (r !== row && board[r][col] === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / rowGroupSize) * rowGroupSize;
  const startCol = Math.floor(col / colGroupSize) * colGroupSize;

  for (let r = startRow; r < startRow + rowGroupSize; r += 1) {
    for (let c = startCol; c < startCol + colGroupSize; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return false;
      }
    }
  }

  return true;
}

export function getCandidates(board, row, col, size, rowGroupSize, colGroupSize) {
  if (board[row][col] !== null) {
    return [];
  }

  const candidates = [];
  for (let value = 1; value <= size; value += 1) {
    if (isValidPlacement(board, row, col, value, rowGroupSize, colGroupSize)) {
      candidates.push(value);
    }
  }

  return candidates;
}

function findBestEmptyCell(board, size, rowGroupSize, colGroupSize) {
  let best = null;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (board[row][col] !== null) {
        continue;
      }

      const candidates = getCandidates(board, row, col, size, rowGroupSize, colGroupSize);
      if (candidates.length === 0) {
        return { row, col, candidates: [] };
      }

      if (!best || candidates.length < best.candidates.length) {
        best = { row, col, candidates };
        if (candidates.length === 1) {
          return best;
        }
      }
    }
  }

  return best;
}

function fillBoard(board, size, rowGroupSize, colGroupSize) {
  const nextCell = findBestEmptyCell(board, size, rowGroupSize, colGroupSize);

  if (!nextCell) {
    return true;
  }

  const { row, col, candidates } = nextCell;
  if (candidates.length === 0) {
    return false;
  }

  for (const value of shuffle(candidates)) {
    board[row][col] = value;
    if (fillBoard(board, size, rowGroupSize, colGroupSize)) {
      return true;
    }
    board[row][col] = null;
  }

  return false;
}

function countSolutions(board, size, rowGroupSize, colGroupSize, limit = 2) {
  const nextCell = findBestEmptyCell(board, size, rowGroupSize, colGroupSize);

  if (!nextCell) {
    return 1;
  }

  const { row, col, candidates } = nextCell;
  if (candidates.length === 0) {
    return 0;
  }

  let total = 0;
  for (const value of candidates) {
    board[row][col] = value;
    total += countSolutions(board, size, rowGroupSize, colGroupSize, limit);
    board[row][col] = null;

    if (total >= limit) {
      return total;
    }
  }

  return total;
}

export function hasBoardConflict(board, rowGroupSize, colGroupSize) {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] && hasConflict(board, row, col, rowGroupSize, colGroupSize)) {
        return true;
      }
    }
  }

  return false;
}

function generateSolvedBoard(size, rowGroupSize, colGroupSize) {
  const board = createEmptyBoard(size);
  fillBoard(board, size, rowGroupSize, colGroupSize);
  return board;
}

function carvePuzzle(solution, size, rowGroupSize, colGroupSize, clueTarget) {
  const puzzle = cloneBoard(solution);
  const indices = shuffle(Array.from({ length: size * size }, (_, i) => i));
  let cluesLeft = size * size;

  for (const index of indices) {
    if (cluesLeft <= clueTarget) {
      break;
    }

    const row = Math.floor(index / size);
    const col = index % size;
    const saved = puzzle[row][col];
    puzzle[row][col] = null;

    const testBoard = cloneBoard(puzzle);
    const solutionCount = countSolutions(testBoard, size, rowGroupSize, colGroupSize, 2);

    if (solutionCount !== 1) {
      puzzle[row][col] = saved;
    } else {
      cluesLeft -= 1;
    }
  }

  return { puzzle, cluesLeft };
}

export function buildPuzzle(mode) {
  const config = mode === "easy" ? MODE_CONFIG.easy : MODE_CONFIG.normal;
  const { size, rowGroupSize, colGroupSize, clueMin, clueMax } = config;
  let best = null;

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const clueTarget = clueMin + Math.floor(Math.random() * (clueMax - clueMin + 1));
    const solution = generateSolvedBoard(size, rowGroupSize, colGroupSize);
    const { puzzle, cluesLeft } = carvePuzzle(solution, size, rowGroupSize, colGroupSize, clueTarget);

    const candidate = {
      mode: config.mode,
      size,
      rowGroupSize,
      colGroupSize,
      solution,
      puzzle,
      cluesLeft,
    };

    if (!best || Math.abs(cluesLeft - clueTarget) < Math.abs(best.cluesLeft - clueTarget)) {
      best = candidate;
    }

    if (cluesLeft >= clueMin && cluesLeft <= clueMax) {
      return {
        mode: candidate.mode,
        size: candidate.size,
        rowGroupSize: candidate.rowGroupSize,
        colGroupSize: candidate.colGroupSize,
        solution: candidate.solution,
        puzzle: candidate.puzzle,
      };
    }
  }

  return {
    mode: best.mode,
    size: best.size,
    rowGroupSize: best.rowGroupSize,
    colGroupSize: best.colGroupSize,
    solution: best.solution,
    puzzle: best.puzzle,
  };
}

function hasConflict(board, row, col, rowGroupSize, colGroupSize) {
  const value = board[row][col];
  if (!value) {
    return false;
  }
  return !isValidPlacement(board, row, col, value, rowGroupSize, colGroupSize);
}

export function evaluateBoard(board, fixedCells, rowGroupSize, colGroupSize) {
  const invalid = createEmptyBoard(board.length).map((row) => row.map(() => false));

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board.length; col += 1) {
      if (!fixedCells[row][col] && board[row][col] && hasConflict(board, row, col, rowGroupSize, colGroupSize)) {
        invalid[row][col] = true;
      }
    }
  }

  return invalid;
}

export function buildCustomPuzzle(puzzle) {
  const { size, rowGroupSize, colGroupSize, mode } = MODE_CONFIG.normal;

  if (
    !Array.isArray(puzzle) ||
    puzzle.length !== size ||
    puzzle.some(
      (row) =>
        !Array.isArray(row) ||
        row.length !== size ||
        row.some((value) => value !== null && (!Number.isInteger(value) || value < 1 || value > size))
    )
  ) {
    throw new Error("Custom puzzle must be a 9x9 grid using numbers 1-9");
  }

  if (hasBoardConflict(puzzle, rowGroupSize, colGroupSize)) {
    throw new Error("Custom puzzle has Sudoku conflicts");
  }

  const filledCells = puzzle.flat().filter((value) => value !== null).length;
  if (filledCells === 0) {
    throw new Error("Custom puzzle cannot be completely empty");
  }

  const solutionProbe = cloneBoard(puzzle);
  const solutionCount = countSolutions(solutionProbe, size, rowGroupSize, colGroupSize, 2);

  if (solutionCount === 0) {
    throw new Error("Custom puzzle has no valid solution");
  }

  if (solutionCount !== 1) {
    throw new Error("Custom puzzle must have exactly one solution");
  }

  const solution = cloneBoard(puzzle);
  fillBoard(solution, size, rowGroupSize, colGroupSize);

  return {
    mode,
    size,
    rowGroupSize,
    colGroupSize,
    puzzle: cloneBoard(puzzle),
    solution,
  };
}
