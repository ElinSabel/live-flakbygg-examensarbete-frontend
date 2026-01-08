import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth";
import { Chat } from "../models/Chat";

const router = Router();

router.get("/:requestId", verifyAccessToken, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id.toString();

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

    const messages = [...chat.messages].sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() -
        new Date(b.createdAt!).getTime()
    );

    res.status(200).json({ messages });
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ messages: [] });
  }
});

export default router;
