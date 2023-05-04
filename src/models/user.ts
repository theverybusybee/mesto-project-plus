import mongoose from "mongoose";
const { Schema } = mongoose;
import { IUser } from "types/user";
const validator = require("validator");

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isURL(value),
    },
  },
});

export default mongoose.model<IUser>("user", userSchema);
