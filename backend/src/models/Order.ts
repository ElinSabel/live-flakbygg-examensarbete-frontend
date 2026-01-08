import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    sellerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    },

    requestId: { 
      type: Schema.Types.ObjectId, 
      ref: "CamperRequest", 
      required: true 
    },

    amount: { 
      type: Number, 
      required: true 
    },

    status: {
      type: String,
      enum: ["created", "processed", "shipped", "completed", "cancelled"],
      default: "created",
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", OrderSchema);