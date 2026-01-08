import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import customerRouter from "./routes/users";
import authRouter from "./routes/auth";
import requestRouter from "./routes/camperRequests";
import orderRouter from "./routes/orders";
import chatRouter from "./routes/chat";
import stripeRouter from "./routes/stripe";
import { webhook } from "./controllers/stripeController";

const app = express();

/* ------------------ CORS ------------------ */
app.use(
  cors({
    origin: [
      "https://live-flakbygg-examensarbete-fronten.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

/* ---------------- Stripe Webhook ---------------- */
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

/* ---------------- JSON ---------------- */
app.use(express.json());

/* ---------------- Routes ---------------- */
app.use("/customers", customerRouter);
app.use("/auth", authRouter);
app.use("/camper-requests", requestRouter);
app.use("/orders", orderRouter);
app.use("/chats", chatRouter);
app.use("/stripe", stripeRouter);

/* ---------------- MongoDB (Serverless Safe) ---------------- */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose
      .connect(process.env.DB_URL as string)
      .then((m) => m);
  }

  cached!.conn = await cached!.promise;
  console.log("✅ MongoDB connected");

  return cached!.conn;
}

app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});



export default app;
