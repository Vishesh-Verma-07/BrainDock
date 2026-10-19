import mongoose, { Schema, Types } from "mongoose";

const User = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // Optional: accounts created through Google sign-in have no password.
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    profileImage: {
      type: String,
    },
    content: [
      {
        type: Types.ObjectId,
        ref: "contents",
      },
    ],
    categories: [
      {
        type: Types.ObjectId,
        ref: "categories",
      },
    ],
  },
  { timestamps: true },
);

const UserModel = mongoose.model("users", User);

export { UserModel };
