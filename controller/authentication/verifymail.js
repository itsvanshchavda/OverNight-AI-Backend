import { User } from "../../models/userModel.js";

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ error: "Plz add the verification code" });
    return;
  }

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    res.status(200).json({ error: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
    });
    console.log(err);
  }
};
