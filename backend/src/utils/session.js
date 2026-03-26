import crypto from "crypto";

export function generateSessionToken() {
  return crypto.randomBytes(24).toString("hex");
}

export function getCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  };
}
