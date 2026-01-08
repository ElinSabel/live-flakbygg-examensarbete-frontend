import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth";
import { Chat, IMessage } from "../models/Chat";
import { JwtPayload } from "jsonwebtoken";

interface JwtUserPayload extends JwtPayload {
  _id: string;
}

const router = Router();

router.get("/:requestId", verifyAccessToken, async (req, res) => {
  try {
    const { requestId } = req.params;

    // Check that req.user exists
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Cast req.user to your JWT payload type
    const user = req.user as JwtUserPayload;
    const userId = user._id.toString();

    const chat = await Chat.findOne({ requestId });

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    // Check if the user is allowed to see this chat
    if (
      chat.customerId.toString() !== userId &&
      chat.sellerId.toString() !== userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Ensure messages have createdAt (optional chaining for safety)
    const messages: IMessage[] = [...chat.messages].sort(
      (a, b) =>
        new Date(a.createdAt ?? 0).getTime() -
        new Date(b.createdAt ?? 0).getTime()
    );

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ messages: [] });
  }
});

export default router;