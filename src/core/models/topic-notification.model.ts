import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITopicNotification extends Document {
  _id: string;
  topicId: Types.ObjectId | string;
  notificationId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const TopicNotificationSchema = new Schema<ITopicNotification>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Topic',
    },
    notificationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Notification',
    },
  },
  {
    timestamps: true,
    collection: 'topicnotifications',
  }
);

export const TopicNotificationModel = mongoose.model<ITopicNotification>('TopicNotification', TopicNotificationSchema);

