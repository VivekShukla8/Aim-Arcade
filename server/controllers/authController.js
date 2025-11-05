import { generateToken } from "../utils/generateToken.js";

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(`${clientUrl}/login?error=auth_failed`);
  }

  const token = generateToken(req.user._id, req.user.role);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  res.redirect(`${clientUrl}/`);
};
