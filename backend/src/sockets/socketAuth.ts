import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;

if (!ACCESS_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined");
}

export interface SocketUser extends JwtPayload {
  _id: string;
  email: string;
  role: "seller" | "customer";
}


export const socketAuth = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(token, ACCESS_SECRET) as SocketUser;

    if (!decoded._id || !decoded.role) {
      return next(new Error("Invalid token payload"));
    }

    socket.data.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    console.error("Socket auth error:", err);
    next(new Error("Unauthorized"));
  }
};
