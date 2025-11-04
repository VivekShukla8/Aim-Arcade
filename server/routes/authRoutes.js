import express from "express";
import passport from "../config/passport.js";
import { googleAuthSuccess } from "../controllers/authController.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate(
      "google",
      { failureRedirect: "http://localhost:5173/login", session: false },
      (err, user, info) => {
        if (err) {
          console.error("Google OAuth error:", err, info);
          return res.redirect("http://localhost:5173/login?error=oauth_token");
        }
        if (!user) {
          console.error("Google OAuth no user:", info);
          return res.redirect("http://localhost:5173/login?error=oauth_no_user");
        }
        req.user = user;
        return googleAuthSuccess(req, res);
      }
    )(req, res, next);
  }
);

export default router;
