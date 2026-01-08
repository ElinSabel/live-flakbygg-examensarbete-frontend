import { Server, Socket } from "socket.io";
import { Chat } from "../models/Chat";

export const chatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    if (!user) return;

    socket.on("joinRequestChat", (requestId: string) => {
      const room = `chat:${requestId}`;
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ requestId, text }: { requestId: string; text: string }) => {
        if (!text?.trim()) return;

        const chat = await Chat.findOne({ requestId });
        if (!chat) {
          console.warn("❌ Chat not found:", requestId);
          return;
        }

        const userId = user._id.toString();

        if (
          chat.customerId.toString() !== userId &&
          chat.sellerId.toString() !== userId
        ) {
          console.warn("❌ Unauthorized message attempt");
          return;
        }

        const message = {
          sender: user._id,
          text,
        };

        chat.messages.push(message);
        await chat.save();

        io.to(`chat:${requestId}`).emit("newMessage", message);
      }
    );
  });
};
