import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/User";
import { sendEmail } from "../utilities/emailServices";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Incorrect credentials" });

  const payload = {
  _id: user._id.toString(),
  email: user.email,
  role: user.role,
};

  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json({
    user: payload,
    token: accessToken,
    expires_in: 60 * 15,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const oldToken = req.cookies?.refreshToken;
  if (!oldToken) return res.status(401).json({ message: "Missing token" });

  let decoded: JwtPayload | string;
  try {
    decoded = jwt.verify(oldToken, REFRESH_SECRET);
  } catch {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  const user = await User.findOne({ refreshToken: oldToken });
  if (!user) return res.status(403).json({ message: "Invalid token" });

  const payload = {
  _id: user._id.toString(),
  email: user.email,
  role: user.role,
};

  const newAccess = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
  const newRefresh = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  user.refreshToken = newRefresh;
  await user.save();

  res.cookie("refreshToken", newRefresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return res.json({ token: newAccess, user: payload });
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    await User.updateOne(
      { refreshToken: token },
      { $set: { refreshToken: "" } }
    );
  }

  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
};


export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "Password Reset",
    `<h1>Reset your password</h1><p><a href="${resetLink}">Click here</a> to reset your password</p>`,
    `Reset your password: ${resetLink}`
  );

  return res.json({ message: "Password reset email sent" });
};


export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body as { token: string; password: string };

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) return res.status(400).json({ message: "Invalid/expired token" });

  user.password = await bcrypt.hash(password, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  return res.json({ message: "Password updated" });
};

