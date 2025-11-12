import { PrismaClient, Notification as PrismaNotification, Topic as PrismaTopic, SubscriberTopic as PrismaSubscriberTopic } from "../../../../generated/prisma/client";
import { NotificationCreateInput, TopicCreateInput } from "../../../../generated/prisma/models";
import { INotificationRepository } from "../INotificationRepository";

export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private readonly prisma: PrismaClient) { }
  async create(_notification: NotificationCreateInput): Promise<PrismaNotification> {
    return this.prisma.notification.create({
      data: _notification,
    });
  }

  async createTopic(_topic: TopicCreateInput): Promise<PrismaTopic> {
    return this.prisma.topic.create({
      data: _topic,
    });
  }

  async findTopicByDomain(domain: string): Promise<PrismaTopic | null> {
    return this.prisma.topic.findUnique({
      where: { domain },
    });
  }

  async findTopicById(topicId: string): Promise<PrismaTopic | null> {
    return this.prisma.topic.findUnique({
      where: { id: topicId },
    });
  }

  async findSubscribedTopic(topicId: string): Promise<PrismaSubscriberTopic[]> {
    return this.prisma.subscriberTopic.findMany({
      where: { topicId: topicId },
    });
  }

  async findById(_id: string): Promise<PrismaNotification | null> {
    return this.prisma.notification.findUnique({
      where: { id: _id },
    });
  }

  async findAll(): Promise<PrismaNotification[]> {
    return this.prisma.notification.findMany();
  }

  async findAllByTopicId(_topicId: string): Promise<PrismaNotification[]> {
    return this.prisma.notification.findMany({
      where: { topicId: _topicId },
    });
  }

  async markAsRead(_ids: string[]): Promise<void> {
    await this.prisma.subscriberNotification.updateMany({
      where: { notificationId: { in: _ids } },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAsDeleted(_ids: string[]): Promise<void> {
    await this.prisma.subscriberNotification.updateMany({
      where: { notificationId: { in: _ids } },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }

  async markAsSent(_ids: string[]): Promise<void> {
    await this.prisma.subscriberNotification.updateMany({
      where: { notificationId: { in: _ids } },
      data: { isSent: true, sentAt: new Date() },
    });
  }
}