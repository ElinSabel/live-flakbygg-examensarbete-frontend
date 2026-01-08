import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let socketReadyPromise: Promise<Socket> | null = null;
let currentToken: string | null = null;

export const connectSocket = (accessToken: string): Socket => {

  if (socket && currentToken === accessToken) {
    return socket;
  }

  if (socket && currentToken !== accessToken) {
    socket.disconnect();
    socket = null;
    socketReadyPromise = null;
  }

  currentToken = accessToken;

  socket = io("http://localhost:3000", {
    auth: { token: accessToken },
    transports: ["websocket"],
    autoConnect: true,
  });

  socketReadyPromise = new Promise((resolve, reject) => {
    if (!socket) {
      reject(new Error("Socket not initialized"));
      return;
    }

    if (socket.connected) {
      resolve(socket);
      return;
    }

    socket.once("connect", () => {
      resolve(socket!);
    });

    socket.once("connect_error", (err) => {
      console.error("❌ Socket connection failed:", err.message);
      reject(err);
    });
  });

  return socket;
};

export const waitForSocket = async (): Promise<Socket> => {
  if (!socketReadyPromise) {
    throw new Error("Socket not initialized. Call connectSocket first.");
  }
  return socketReadyPromise;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();

  socket = null;
  socketReadyPromise = null;
  currentToken = null;

  console.log("Socket disconnected");
};
