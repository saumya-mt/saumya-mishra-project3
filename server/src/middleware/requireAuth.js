import User from "../models/User.js";
import createHttpError from "../utils/httpError.js";

export default async function requireAuth(request, _response, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "sudoku_session";
    const sessionToken = request.cookies[cookieName];

    if (!sessionToken) {
      throw createHttpError(401, "Login required");
    }

    const user = await User.findOne({ sessionToken });
    if (!user) {
      throw createHttpError(401, "Invalid session");
    }

    request.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
