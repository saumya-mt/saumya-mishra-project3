import GameProgress from "../models/GameProgress.js";
import SudokuGame from "../models/SudokuGame.js";
import User from "../models/User.js";
import { buildCustomPuzzle, buildPuzzle } from "../../../src/utils/sudoku.js";
import createHttpError from "../utils/httpError.js";
import { generateGameName } from "../utils/gameNames.js";

function mapGameSummary(game) {
  return {
    id: game._id,
    name: game.name,
    difficulty: game.difficulty,
    createdAt: game.createdAt,
    creatorUsername: game.creator?.username || "Unknown",
  };
}

function mapGameDetails(game, userId) {
  const completed = userId ? game.completedBy.some((value) => String(value) === String(userId)) : false;

  return {
    id: game._id,
    name: game.name,
    difficulty: game.difficulty,
    mode: game.mode,
    size: game.size,
    rowGroupSize: game.rowGroupSize,
    colGroupSize: game.colGroupSize,
    puzzle: completed ? game.solution : game.puzzle,
    solution: game.solution,
    createdAt: game.createdAt,
    creatorUsername: game.creator?.username || "Unknown",
    creatorId: game.creator?._id || null,
    isOwner: userId ? String(game.creator?._id) === String(userId) : false,
    completed,
  };
}

function validateBoardShape(board, size) {
  return (
    Array.isArray(board) &&
    board.length === size &&
    board.every(
      (row) =>
        Array.isArray(row) &&
        row.length === size &&
        row.every((value) => value === null || (Number.isInteger(value) && value >= 1 && value <= size))
    )
  );
}

async function generateUniqueGameName() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateGameName();
    const existing = await SudokuGame.findOne({ name: candidate });
    if (!existing) {
      return candidate;
    }
  }

  return `${generateGameName()} ${Date.now()}`;
}

async function createStoredGame({ builtGame, creatorId, difficulty }) {
  const game = await SudokuGame.create({
    name: await generateUniqueGameName(),
    difficulty,
    mode: builtGame.mode,
    size: builtGame.size,
    rowGroupSize: builtGame.rowGroupSize,
    colGroupSize: builtGame.colGroupSize,
    puzzle: builtGame.puzzle,
    solution: builtGame.solution,
    creator: creatorId,
  });

  await GameProgress.create({
    game: game._id,
    user: creatorId,
    board: builtGame.puzzle,
    secondsElapsed: 0,
  });

  return game;
}

export async function listGames(_request, response, next) {
  try {
    const games = await SudokuGame.find({})
      .populate("creator", "username")
      .sort({ createdAt: -1 });

    response.json(games.map(mapGameSummary));
  } catch (error) {
    next(error);
  }
}

export async function createGame(request, response, next) {
  try {
    const { difficulty } = request.body;
    if (!difficulty || !["EASY", "NORMAL"].includes(difficulty)) {
      throw createHttpError(400, "Difficulty must be EASY or NORMAL");
    }

    const mode = difficulty === "EASY" ? "easy" : "normal";
    const builtGame = buildPuzzle(mode);
    const game = await createStoredGame({
      builtGame,
      creatorId: request.user._id,
      difficulty,
    });

    response.status(201).json({ gameId: game._id });
  } catch (error) {
    next(error);
  }
}

export async function createCustomGame(request, response, next) {
  try {
    const { puzzle } = request.body;

    let builtGame;
    try {
      builtGame = buildCustomPuzzle(puzzle);
    } catch (error) {
      throw createHttpError(400, error.message);
    }

    const game = await createStoredGame({
      builtGame,
      creatorId: request.user._id,
      difficulty: "CUSTOM",
    });

    response.status(201).json({ gameId: game._id });
  } catch (error) {
    next(error);
  }
}

export async function getGame(request, response, next) {
  try {
    const game = await SudokuGame.findById(request.params.gameId).populate("creator", "username");
    if (!game) {
      throw createHttpError(404, "Game not found");
    }

    const details = mapGameDetails(game, request.user?._id);

    if (!request.user) {
      response.json({
        ...details,
        initialPuzzle: game.puzzle,
        board: details.puzzle,
        secondsElapsed: 0,
      });
      return;
    }

    const progress = await GameProgress.findOne({
      game: game._id,
      user: request.user._id,
    });

    const board = details.completed
      ? game.solution
      : progress?.board || game.puzzle;

    response.json({
      ...details,
      initialPuzzle: game.puzzle,
      board,
      secondsElapsed: progress?.secondsElapsed || 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateGame(request, response, next) {
  try {
    const game = await SudokuGame.findById(request.params.gameId);
    if (!game) {
      throw createHttpError(404, "Game not found");
    }

    const { board, secondsElapsed, resetProgress } = request.body;

    if (board || typeof secondsElapsed === "number" || resetProgress) {
      const nextBoard = resetProgress ? game.puzzle : board;
      const nextSecondsElapsed = resetProgress ? 0 : Math.max(0, Number(secondsElapsed || 0));

      if (!validateBoardShape(nextBoard, game.size)) {
        throw createHttpError(400, "Invalid board payload");
      }

      await GameProgress.findOneAndUpdate(
        {
          game: game._id,
          user: request.user._id,
        },
        {
          board: nextBoard,
          secondsElapsed: nextSecondsElapsed,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      response.json({ message: "Progress saved" });
      return;
    }

    if (String(game.creator) !== String(request.user._id)) {
      throw createHttpError(403, "Only the creator can update this game");
    }

    const allowedFields = ["name", "difficulty"];
    for (const field of allowedFields) {
      if (request.body[field]) {
        game[field] = request.body[field];
      }
    }

    await game.save();
    response.json({ message: "Game updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteGame(request, response, next) {
  try {
    const game = await SudokuGame.findById(request.params.gameId);
    if (!game) {
      throw createHttpError(404, "Game not found");
    }

    if (String(game.creator) !== String(request.user._id)) {
      throw createHttpError(403, "Only the creator can delete this game");
    }

    const completedUserIds = [...game.completedBy];
    await GameProgress.deleteMany({ game: game._id });
    await game.deleteOne();

    if (completedUserIds.length > 0) {
      await User.updateMany(
        { _id: { $in: completedUserIds }, wins: { $gt: 0 } },
        { $inc: { wins: -1 } }
      );
    }

    response.json({ message: "Game deleted" });
  } catch (error) {
    next(error);
  }
}
