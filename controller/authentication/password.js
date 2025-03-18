import { User } from "../../models/userModel.js";
import crypto from "crypto";
import {
  sendForgotPass,
  sendSuccessResetPassword,
} from "../../utils/sendEmail.js";
import bcrypt from "bcryptjs";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: "User not found!!" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendForgotPass(user.email, resetToken);

    res.status(200).json({
      message: "Password reset link sent to your email",
      token: resetToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.error(error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: "Password is required",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    const hashPass = await bcrypt.hash(password.toString(), 10);
    user.password = hashPass;

    await user.save();

    await sendSuccessResetPassword(user.email);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Internal server error",
    });
    console.error(err);
  }
};
