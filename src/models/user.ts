import { model, Model, Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/user';
import {
  DEFAULT_ABOUT,
  DEFAULT_AVATAR,
  DEFAULT_USERNAME,
} from '../utils/constants/default-data';

const validator = require('validator');

export interface UserModel extends Model<IUser> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<Document<unknown, any, IUser>>;
}

const userSchema = new Schema<IUser, UserModel>(
  {
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
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

userSchema.static(
  'findUserByCredentials',
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select('+password')
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
      });
  }
);

export default model<IUser, UserModel>('User', userSchema);
