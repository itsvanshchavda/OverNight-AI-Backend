import express, { Router } from "express";
import { signupUser } from "../controller/authentication/signup.js";
import { verifyEmail } from "../controller/authentication/verifymail.js";
import { loginUser } from "../controller/authentication/login.js";
import { getUser } from "../controller/authentication/getuser.js";
import {
  forgotPassword,
  resetPassword,
} from "../controller/authentication/password.js";
import { verifyUser } from "../middleware/verifyuser.js";
import passport from "passport";
import { googleAuthCallback } from "../controller/authentication/oauth.js";

const router = Router();

router.post("/signup", signupUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.get("/getuser", verifyUser, getUser);
router.post("/forgot-password", verifyUser, forgotPassword);
router.post("/reset-password/:token", resetPassword);

// These routes should be in your authRoutes.js file
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthCallback // This is where googleAuthCallback is used
);

export default router;
