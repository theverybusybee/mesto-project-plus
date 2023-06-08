import mongoose from 'mongoose';
import { IUser } from '../types/user';
import {
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
  DEFAULT_USERNAME,
} from 'constants/dafault-data';

const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: DEFAULT_USERNAME,
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: DEFAULT_ABOUT,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isURL(value),
    },
    default: DEFAULT_AVATAR,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isStrongPassword(value),
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
