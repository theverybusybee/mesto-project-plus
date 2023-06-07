import mongoose from 'mongoose';
import { IUser } from '../types/user';

const { Schema } = mongoose;
const validator = require('validator');

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'theverybusybee',
  },
  about: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
    default: 'explorer of flowers',
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => validator.isURL(value),
    },
    default:
      'https://i.pinimg.com/750x/42/f4/d9/42f4d9a60b8e4afd57c8ed83f1808ea7.jpg',
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
