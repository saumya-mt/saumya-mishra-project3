import { Router } from "express";
import {
  createGame,
  createCustomGame,
  deleteGame,
  getGame,
  listGames,
  updateGame,
} from "../controllers/sudokuController.js";
import optionalAuth from "../middleware/optionalAuth.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/", listGames);
router.post("/", requireAuth, createGame);
router.post("/custom", requireAuth, createCustomGame);
router.get("/:gameId", optionalAuth, getGame);
router.put("/:gameId", requireAuth, updateGame);
router.delete("/:gameId", requireAuth, deleteGame);

export default router;
