import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { logError } from "../utilities/logger";

export const userController = {
  createUser: async (req: Request, res: Response) => {
    try {
      const { password, ...rest } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        ...rest,
        password: hashedPassword,
      });

      const saved = await user.save();

      return res.status(201).json({
        message: "User created",
        id: saved._id,
        email: saved.email,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },

  getAllUsers: async (_req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: logError(error) });
    }
  },

  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id);
      user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error: logError(error) });
    }
  },

  getUserByEmail: async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      user
        ? res.json(user)
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error: logError(error) });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) return res.status(404).json({ message: "User not found" });

      return res.json({ message: "User updated", user: updated });
    } catch (error: any) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "Email is already in use by another user" });
      }
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      deleted
        ? res.json({ message: "User deleted" })
        : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error: logError(error) });
    }
  },
};