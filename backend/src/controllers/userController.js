import bcrypt from "bcryptjs";
import User from "../models/User.js";
import createHttpError from "../utils/httpError.js";
import { getCookieOptions, generateSessionToken } from "../utils/session.js";

const SALT_ROUNDS = 10;

function sanitizeUser(user) {
  return {
    id: user._id,
    username: user.username,
    wins: user.wins,
  };
}

export async function getLoggedInUser(request, response, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "sudoku_session";
    const sessionToken = request.cookies[cookieName];

    if (!sessionToken) {
      throw createHttpError(401, "No user logged in");
    }

    const user = await User.findOne({ sessionToken });
    if (!user) {
      throw createHttpError(401, "Session expired");
    }

    response.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
}

export async function registerUser(request, response, next) {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      throw createHttpError(400, "Username and password are required");
    }

    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      throw createHttpError(409, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const sessionToken = generateSessionToken();
    const user = await User.create({
      username: username.trim(),
      password: hashedPassword,
      sessionToken,
    });

    response.cookie(process.env.COOKIE_NAME || "sudoku_session", sessionToken, getCookieOptions());
    response.status(201).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
}

export async function loginUser(request, response, next) {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      throw createHttpError(400, "Username and password are required");
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      throw createHttpError(401, "Invalid username or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw createHttpError(401, "Invalid username or password");
    }

    user.sessionToken = generateSessionToken();
    await user.save();

    response.cookie(
      process.env.COOKIE_NAME || "sudoku_session",
      user.sessionToken,
      getCookieOptions()
    );
    response.json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
}
