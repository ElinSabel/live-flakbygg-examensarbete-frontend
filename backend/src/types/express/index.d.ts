import type { JwtPayload } from "jsonwebtoken";
import type mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;
    }
  }

  var mongoose:
    | {
        conn: mongoose.Mongoose | null;
        promise: Promise<mongoose.Mongoose> | null;
      }
    | undefined;
}

export {};
