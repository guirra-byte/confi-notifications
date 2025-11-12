import { Notification as PrismaNotification, Topic as PrismaTopic, SubscriberTopic as PrismaSubscriberTopic } from "../../../generated/prisma/client";
import { NotificationCreateInput, TopicCreateInput } from "../../../generated/prisma/models";

export interface INotificationRepository {
  create(notification: NotificationCreateInput): Promise<PrismaNotification>;
  createTopic(topic: TopicCreateInput): Promise<PrismaTopic>;

  findSubscribedTopic(topicId: string): Promise<PrismaSubscriberTopic[]>;
  findTopicByDomain(domain: string): Promise<PrismaTopic | null>;
  findTopicById(topicId: string): Promise<PrismaTopic | null>;

  findById(id: string): Promise<PrismaNotification | null>;
  findAll(): Promise<PrismaNotification[]>;
  findAllByTopicId(topicId: string): Promise<PrismaNotification[]>;

  markAsRead(ids: string[]): Promise<void>;
  markAsDeleted(ids: string[]): Promise<void>;
  markAsSent(ids: string[]): Promise<void>;
}