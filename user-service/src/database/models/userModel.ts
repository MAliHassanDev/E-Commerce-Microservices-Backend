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
      default: "https://firebasestorage.googleapis.com/v0/b/zaply-dd3b4.appspot.com/o/UserAvatarImage%2FDefaultAvatar.jpeg?alt=media&token=cb068ad9-6691-4e8e-870c-2254c0ed3ec8"
    }
  },
  {
    timestamps: true,
  }
);

const User = model<User>('users', userSchema);

export default User;