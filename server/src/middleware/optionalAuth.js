import User from "../models/User.js";

export default async function optionalAuth(request, _response, next) {
  try {
    const cookieName = process.env.COOKIE_NAME || "sudoku_session";
    const sessionToken = request.cookies[cookieName];

    if (!sessionToken) {
      request.user = null;
      next();
      return;
    }

    const user = await User.findOne({ sessionToken });
    request.user = user || null;
    next();
  } catch (error) {
    next(error);
  }
}
