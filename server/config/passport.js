import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

const callbackURL = process.env.GOOGLE_CALLBACK_URL;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !callbackURL) {
  throw new Error("Missing Google OAuth env vars: GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_CALLBACK_URL");
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        if (!email) return done(new Error("No email from Google"));

        // Link existing account by email if present, else create new
        let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

        const ownerEmails = (process.env.OWNER_EMAILS || "").split(",").map(e => e.trim()).filter(Boolean);
        const role = ownerEmails.includes(email) ? "owner" : "player";

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email,
            googleAuth: true,
            authType: "google",
            role,
          });
        } else {
          // Update linkage if needed
          user.googleId = user.googleId || profile.id;
          user.name = user.name || profile.displayName;
          user.googleAuth = true;
          user.authType = "google";
          if (!user.role) user.role = role;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;