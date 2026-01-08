import { getSocket, waitForSocket } from "../services/socketServices";

export const joinRequestChat = async (requestId: string) => {
  const socket = await waitForSocket();
  socket.emit("joinRequestChat", requestId);
};

export const sendMessage = async (requestId: string, text: string) => {
  const socket = await waitForSocket();
  socket.emit("sendMessage", { requestId, text });
};

export const onNewMessage = async (cb: (msg: any) => void) => {
  const socket = await waitForSocket();
  socket.off("newMessage");
  socket.on("newMessage", cb);
};

export const offNewMessage = () => {
  const socket = getSocket();
  if (!socket) return;
  socket.off("newMessage");
};
