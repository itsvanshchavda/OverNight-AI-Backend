import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const decoded = await jwt.verify(token, process.env.JWTSecret);

  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = await User.findById({ _id: decoded._id });

  if (!user) {
    return res.status(401).json({ error: "No user found" });
  }

  req.user = decoded;
  next();
};
