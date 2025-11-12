import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: 'subscribers',
  }
);

export const SubscriberModel = mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);

