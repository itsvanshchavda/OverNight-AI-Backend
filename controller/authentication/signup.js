import { User } from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateOtp } from "../../utils/generateOtp.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail.js";
export const signupUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({
        error: "All fields are required!!",
      });
      return;
    }

    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400).json({
        error: "User is already exists!!",
      });
      return;
    }

    const newUser = await User({
      name: name,
      email: email,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const hashpass = await bcrypt.hash(password, 10);
    newUser.password = hashpass;

    //utils -> generateOtp.js
    const otp = generateOtp();
    newUser.verificationToken = otp;

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    const token = jwt.sign({ _id: newUser._id }, process.env.JWTSecret, {
      expiresIn: "7d",
    });
    newUser.token = token;

    await newUser.save();

    if (otp && email && name) {
      sendEmail(otp, email, name);
    }

    res.status(200).json({
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });

    //utils generateJwt.js
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
    });
    console.log(err);
  }
};
