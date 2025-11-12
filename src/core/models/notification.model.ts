import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  subject: string;
  topicId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    subject: {
      type: String,
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Topic',
    },
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);

export const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

