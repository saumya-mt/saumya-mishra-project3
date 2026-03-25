import GameProgress from "../models/GameProgress.js";
import SudokuGame from "../models/SudokuGame.js";
import User from "../models/User.js";
import createHttpError from "../utils/httpError.js";

export async function listHighscores(_request, response, next) {
  try {
    const users = await User.find({ wins: { $gt: 0 } })
      .select("username wins")
      .sort({ wins: -1, username: 1 });

    response.json(
      users.map((user) => ({
        username: user.username,
        wins: user.wins,
      }))
    );
  } catch (error) {
    next(error);
  }
}

export async function markGameCompleted(request, response, next) {
  try {
    const { gameId } = request.body;
    if (!gameId) {
      throw createHttpError(400, "gameId is required");
    }

    const game = await SudokuGame.findById(gameId);
    if (!game) {
      throw createHttpError(404, "Game not found");
    }

    const alreadyCompleted = game.completedBy.some((value) => String(value) === String(request.user._id));

    if (!alreadyCompleted) {
      game.completedBy.push(request.user._id);
      await game.save();
      request.user.wins += 1;
      await request.user.save();
    }

    await GameProgress.findOneAndUpdate(
      {
        game: game._id,
        user: request.user._id,
      },
      {
        board: game.solution,
        completedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    response.status(200).json({ message: "High score updated" });
  } catch (error) {
    next(error);
  }
}

export async function getGameHighscore(request, response, next) {
  try {
    const game = await SudokuGame.findById(request.params.gameId).populate("completedBy", "username");
    if (!game) {
      throw createHttpError(404, "Game not found");
    }

    response.json({
      gameId: game._id,
      winners: game.completedBy
        .map((user) => user.username)
        .sort((left, right) => left.localeCompare(right)),
    });
  } catch (error) {
    next(error);
  }
}
