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

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = req.user as JwtUserPayload;
    const userId = user._id.toString();

    const chat = await Chat.findOne({ requestId });

    if (!chat) {
      return res.status(200).json({ messages: [] });
    }

    if (
      chat.customerId.toString() !== userId &&
      chat.sellerId.toString() !== userId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

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