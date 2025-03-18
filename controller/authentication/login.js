import { User } from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "All fields are required!!",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "User not found!!" });
      return;
    }

    const isPassValid = await bcrypt.compare(password, user?.password);

    if (!isPassValid) {
      res.status(400).json({
        error: "Invalid password!!",
      });
      return;
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWTSecret, {
      expiresIn: "7d",
    });
    user.token = token;

    user.lastLogin = Date.now();

    await user.save();

    res.status(200).json({
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};
