import { ObjectId } from "mongodb";
import { Schema, Types } from "mongoose";

export interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Types.ObjectId>,
  createdAt: Date;
}
