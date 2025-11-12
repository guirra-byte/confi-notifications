import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscriberNotification extends Document {
  _id: string;
  isSent: boolean;
  sentAt?: Date;
  isRead: boolean;
  readAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  subscriberId: Types.ObjectId | string;
  notificationId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberNotificationSchema = new Schema<ISubscriberNotification>(
  {
    isSent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    subscriberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Subscriber',
    },
    notificationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Notification',
    },
  },
  {
    timestamps: true,
    collection: 'subscribernotifications',
  }
);

// Índices equivalentes ao Prisma
SubscriberNotificationSchema.index({ subscriberId: 1 });
SubscriberNotificationSchema.index({ notificationId: 1 });
SubscriberNotificationSchema.index({ subscriberId: 1, notificationId: 1 }, { unique: true });

export const SubscriberNotificationModel = mongoose.model<ISubscriberNotification>(
  'SubscriberNotification',
  SubscriberNotificationSchema
);

