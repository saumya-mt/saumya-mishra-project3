import dotenv from "dotenv";
import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../backend/src/app.js";
import connectToDatabase from "../backend/src/config/db.js";

dotenv.config();

async function run() {
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      ip: "127.0.0.1",
      port: 27027,
    },
  });
  process.env.MONGO = mongoServer.getUri();
  process.env.COOKIE_NAME = "sudoku_session";

  await connectToDatabase();

  const agent = request.agent(app);

  const registerResponse = await agent
    .post("/api/user/register")
    .send({ username: "smoke_user", password: "secret123" })
    .expect(201);

  if (registerResponse.body.username !== "smoke_user") {
    throw new Error("Register response did not return the expected username");
  }

  const createGameResponse = await agent
    .post("/api/sudoku")
    .send({ difficulty: "EASY" })
    .expect(201);

  const gameId = createGameResponse.body.gameId;
  if (!gameId) {
    throw new Error("Game creation did not return a game id");
  }

  const initialGameResponse = await agent.get(`/api/sudoku/${gameId}`).expect(200);
  const initialBoard = initialGameResponse.body.board;
  const solution = initialGameResponse.body.solution;

  const updatedBoard = initialBoard.map((row) => [...row]);
  let filledCell = null;

  for (let row = 0; row < updatedBoard.length; row += 1) {
    for (let col = 0; col < updatedBoard[row].length; col += 1) {
      if (updatedBoard[row][col] === null) {
        updatedBoard[row][col] = solution[row][col];
        filledCell = { row, col };
        break;
      }
    }

    if (filledCell) {
      break;
    }
  }

  if (!filledCell) {
    throw new Error("Expected at least one empty cell in the generated game");
  }

  await agent
    .put(`/api/sudoku/${gameId}`)
    .send({ board: updatedBoard, secondsElapsed: 12 })
    .expect(200);

  const persistedProgressResponse = await agent.get(`/api/sudoku/${gameId}`).expect(200);
  if (persistedProgressResponse.body.board[filledCell.row][filledCell.col] !== solution[filledCell.row][filledCell.col]) {
    throw new Error("Saved progress was not returned on reload");
  }

  await agent.post("/api/highscore").send({ gameId }).expect(200);

  const completedReloadResponse = await agent.get(`/api/sudoku/${gameId}`).expect(200);
  if (!completedReloadResponse.body.completed) {
    throw new Error("Completed game did not report completed=true");
  }

  const completedBoard = JSON.stringify(completedReloadResponse.body.board);
  const solutionBoard = JSON.stringify(solution);
  if (completedBoard !== solutionBoard) {
    throw new Error("Completed game did not return the solved board on reload");
  }

  const normalGameResponse = await agent
    .post("/api/sudoku")
    .send({ difficulty: "NORMAL" })
    .expect(201);

  const normalGameId = normalGameResponse.body.gameId;
  const normalGameDetails = await agent.get(`/api/sudoku/${normalGameId}`).expect(200);
  const customPuzzle = normalGameDetails.body.initialPuzzle.map((row) => [...row]);

  const customGameResponse = await agent
    .post("/api/sudoku/custom")
    .send({ puzzle: customPuzzle })
    .expect(201);

  if (!customGameResponse.body.gameId) {
    throw new Error("Custom game creation did not return a game id");
  }

  console.log("Smoke test passed: auth, progress save, completed-game reload, and custom-game creation all work.");

  await mongoose.disconnect();
  await mongoServer.stop();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
