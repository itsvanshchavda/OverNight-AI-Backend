import { User } from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const googleAuthCallback = async (req, res) => {
  try {
    const profile = req.user;
    const userEmail = profile.emails[0].value;

    const generateToken = (userId) => {
      return jwt.sign({ _id: userId }, process.env.JWTSecret, {
        expiresIn: "7d",
      });
    };

    // Find user by email
    let user = await User.findOne({ email: userEmail });

    if (user) {
      // User exists - update Google info if not already set
      if (!user.googleId) {
        user.googleId = profile.id;
        user.provider = "google";

        await user.save();
      }
    } else {
      // Create new user if not exists
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: userEmail,
        provider: "google",
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    user.token = token;
    user.lastLogin = Date.now();
    await user.save();

    res.status(200).json({
      user: {
        ...user._doc,
        password: undefined,
        token: token,
      },
    });
  } catch (error) {
    console.error("Google auth callback error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
