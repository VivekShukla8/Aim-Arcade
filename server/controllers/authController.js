import { generateToken } from "../utils/generateToken.js";

export const googleAuthSuccess = (req, res) => {
  if (!req.user) {
    return res.redirect("http://localhost:5173/login?error=auth_failed");
  }

  const token = generateToken(req.user._id, req.user.role);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.redirect("http://localhost:5173/");
};
