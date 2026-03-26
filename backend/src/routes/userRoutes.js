import { Router } from "express";
import { getLoggedInUser, loginUser, registerUser } from "../controllers/userController.js";

const router = Router();

router.get("/isLoggedIn", getLoggedInUser);
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
