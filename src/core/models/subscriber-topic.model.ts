import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISubscriberTopic extends Document {
  _id: string;
  subscriberId: Types.ObjectId | string;
  topicId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberTopicSchema = new Schema<ISubscriberTopic>(
  {
    subscriberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Subscriber',
    },
    topicId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Topic',
    },
  },
  {
    timestamps: true,
    collection: 'subscribertopics',
  }
);

export const SubscriberTopicModel = mongoose.model<ISubscriberTopic>('SubscriberTopic', SubscriberTopicSchema);

