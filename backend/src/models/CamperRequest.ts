import mongoose, { Schema } from "mongoose";

const RequestSchema = new Schema(
  {
    customerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true },

    dimensions: {
      height: { type: Number, required: true },
      width: { type: Number, required: true },
      length: { type: Number, required: true },

      bedLength: { type: Number, default: 0 },
      bedHeight: { type: Number, default: 0 },

      doorDimensions: {
        doorPlacement: {
          type: String,
          enum: ["right", "left", "aft"],
          required: true,
        },
        doorWidth: { type: Number, required: true },
        doorHeight: { type: Number, required: true },
      },

      windowOptions: {
        rightWindowHeight: { type: Number, default: 0 },
        rightWindowLength: { type: Number, default: 0 },
        leftWindowHeight: { type: Number, default: 0 },
        leftWindowLength: { type: Number, default: 0 },
        bedWindowHeight: { type: Number, default: 0 },
        bedWindowLength: { type: Number, default: 0 },
        rearWindowHeight: { type: Number, default: 0 },
        rearWindowLength: { type: Number, default: 0 },
      },
    },

    preferences: {
      type: String,
      default: "",
    },

    agreedPrice:{
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["requested", "assigned", "approved", "paid"],
      default: "requested",
      required: true,
    },

    sellerId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  }
);

export const CamperRequest = mongoose.model("CamperRequest", RequestSchema);
