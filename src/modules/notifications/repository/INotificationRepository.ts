import { INotification, ITopic, ISubscriberTopic } from "../../../core/models";

export interface NotificationCreateInput {
  subject: string;
  topicId: string;
}

export interface TopicCreateInput {
  domain: string;
  description?: string;
}

export interface INotificationRepository {
  create(notification: NotificationCreateInput): Promise<INotification>;
  createTopic(topic: TopicCreateInput): Promise<ITopic>;

  findSubscribedTopic(topicId: string): Promise<ISubscriberTopic[]>;
  findTopicByDomain(domain: string): Promise<ITopic | null>;
  findTopicById(topicId: string): Promise<ITopic | null>;

  findById(id: string): Promise<INotification | null>;
  findAll(): Promise<INotification[]>;
  findAllByTopicId(topicId: string): Promise<INotification[]>;

  markAsRead(ids: string[]): Promise<void>;
  markAsDeleted(ids: string[]): Promise<void>;
  markAsSent(ids: string[]): Promise<void>;
}