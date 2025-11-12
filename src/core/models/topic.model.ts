import mongoose, { Schema, Document } from 'mongoose';

export interface ITopic extends Document {
  _id: string;
  domain: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    domain: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'topics',
  }
);

export const TopicModel = mongoose.model<ITopic>('Topic', TopicSchema);

