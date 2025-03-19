import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authroutes.js";
import { connectDB } from "./db/connectDB.js";
import "./helpers/auth.js";
import studentRoutes from "./routes/studentroute.js";
import syllabusRoutes from "./routes/syllabusroutes.js";
dotenv.config();

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "cats",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port: ${PORT}`);
});
