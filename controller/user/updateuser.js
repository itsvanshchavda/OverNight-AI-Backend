import { User } from "../../models/userModel.js";
import bcrypt from "bcryptjs";

export const updateUser = async (req, res) => {
  try {
    const id = req.user._id;

    if (id) {
      const { name, password, onboarding_step } = req.body;

      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }

      if (name) user.name = name;

      if (password) {
        const hashPass = await bcrypt.hash(password, 10);
        user.password = hashPass;
      }

      if (onboarding_step !== undefined) {
        if (typeof onboarding_step !== "number" || onboarding_step < 0) {
          res.status(400).json({
            error: "onboarding value should be number",
          });
        }

        user.onboarding_step = onboarding_step;
      }

      await user.save();

      res.status(200).json({
        message: "User updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          onboarding_step: user.onboarding_step,
          lastLogin: user.lastLogin,
          isVerified: user.isVerified,
          provider: user.provider,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    }

    if (!id) {
      res.status(400).json({
        error: "Unauthorized user",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({
      error: "Error updating user",
      message: err.message,
    });
  }
};
