import mongoose, { Schema, Document } from "mongoose";

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    streetAddress: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    refreshToken: { type: String, default: "" },
    passwordResetToken: {
  type: String,
  default: undefined, 
},
passwordResetExpires: {
  type: Date,
  default: undefined,  
},
    role: {
      type: String,
      enum: ["seller", "customer"],
      default: "customer",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
