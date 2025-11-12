import mongoose from 'mongoose';
import { INotificationRepository, NotificationCreateInput, TopicCreateInput } from "../INotificationRepository";
import {
  INotification,
  ITopic,
  ISubscriberTopic,
  NotificationModel,
  TopicModel,
  SubscriberTopicModel,
  SubscriberNotificationModel,
} from "../../../../core/models";

export class MongooseNotificationRepository implements INotificationRepository {
  async create(notification: NotificationCreateInput): Promise<INotification> {
    return await NotificationModel.create({
      subject: notification.subject,
      topicId: new mongoose.Types.ObjectId(notification.topicId),
    });
  }

  async createTopic(topic: TopicCreateInput): Promise<ITopic> {
    return await TopicModel.create({
      domain: topic.domain,
      description: topic.description,
    });
  }

  async findTopicByDomain(domain: string): Promise<ITopic | null> {
    return await TopicModel.findOne({ domain });
  }

  async findTopicById(topicId: string): Promise<ITopic | null> {
    return await TopicModel.findById(topicId);
  }

  async findSubscribedTopic(topicId: string): Promise<ISubscriberTopic[]> {
    return await SubscriberTopicModel.find({ topicId: new mongoose.Types.ObjectId(topicId) });
  }

  async findById(id: string): Promise<INotification | null> {
    return await NotificationModel.findById(id);
  }

  async findAll(): Promise<INotification[]> {
    return await NotificationModel.find();
  }

  async findAllByTopicId(topicId: string): Promise<INotification[]> {
    return await NotificationModel.find({ topicId: new mongoose.Types.ObjectId(topicId) });
  }

  async markAsRead(ids: string[]): Promise<void> {
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    await SubscriberNotificationModel.updateMany(
      { notificationId: { $in: objectIds } },
      { isRead: true, readAt: new Date() }
    );
  }

  async markAsDeleted(ids: string[]): Promise<void> {
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    await SubscriberNotificationModel.updateMany(
      { notificationId: { $in: objectIds } },
      { isDeleted: true, deletedAt: new Date() }
    );
  }

  async markAsSent(ids: string[]): Promise<void> {
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    await SubscriberNotificationModel.updateMany(
      { notificationId: { $in: objectIds } },
      { isSent: true, sentAt: new Date() }
    );
  }
}

