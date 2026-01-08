import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
  sender: Types.ObjectId;
  text: string;
  createdAt?: Date;
}

export interface IChat {
  requestId: Types.ObjectId;
  customerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

const ChatSchema = new Schema<IChat>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "CamperRequest",
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
