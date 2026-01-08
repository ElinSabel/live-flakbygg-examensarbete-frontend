import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";
import { socketAuth } from "./sockets/socketAuth";
import { chatSocket } from "./sockets/chatSocket";

import customerRouter from "./routes/users";
import authRouter from "./routes/auth";
import requestRouter from "./routes/camperRequests";
import orderRouter from "./routes/orders";
import chatRouter from "./routes/chat";
import stripeRouter from "./routes/stripe";
import { webhook } from "./controllers/stripeController";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.post("/stripe/webhook", express.raw({ type: "application/json" }), webhook);
app.use(express.json());

app.use("/customers", customerRouter);
app.use("/auth", authRouter);
app.use("/camper-requests", requestRouter);
app.use("/orders", orderRouter);
app.use("/chats", chatRouter);
app.use("/stripe", stripeRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.use(socketAuth);
chatSocket(io);

const startServer = async () => {
  await mongoose.connect(process.env.DB_URL as string);
  console.log("✅ MongoDB connected");

  httpServer.listen(3000, () =>
    console.log("🚀 Server running on port 3000")
  );
};

startServer();

export default app;