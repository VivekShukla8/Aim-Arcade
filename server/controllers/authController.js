import { generateToken } from "../utils/generateToken.js";

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/login?error=auth_failed`);
  }

  const token = generateToken(req.user._id, req.user.role);

  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${clientUrl}/`);
};
