import { Schema, model } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const User = model<User>('users', userSchema);

export default User;