import { Router } from "express";
import {
  getGameHighscore,
  listHighscores,
  markGameCompleted,
} from "../controllers/highscoreController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = Router();

router.get("/", listHighscores);
router.post("/", requireAuth, markGameCompleted);
router.get("/:gameId", getGameHighscore);

export default router;
