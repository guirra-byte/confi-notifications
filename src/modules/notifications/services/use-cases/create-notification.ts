import { PrismaClient } from "../../../../generated/prisma/client";
import { INotificationRepository } from "../../repository/INotificationRepository";

interface CreateNotificationRequest {
  topicId: string;
  subject: string;
}

export class CreateNotification {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly prisma: PrismaClient
  ) { }

  async execute(data: CreateNotificationRequest) {
    const topicExists = await this.notificationRepository.findTopicById(data.topicId);
    if (!topicExists) {
      throw new Error("Topic not found");
    }

    const notification = await this.notificationRepository.create({
      topicId: data.topicId,
      subject: data.subject,
    });

    await this.prisma.topicNotification.create({
      data: {
        topicId: data.topicId,
        notificationId: notification.id,
      },
    });

    const topicSubscriptions = await this.notificationRepository.findSubscribedTopic(data.topicId);
    if (!topicSubscriptions || topicSubscriptions.length === 0) {
      return notification;
    }

    await Promise.all(topicSubscriptions.map(async ({ subscriberId }) => {
      await this.prisma.subscriberNotification.create({
        data: {
          subscriberId: subscriberId,
          notificationId: notification.id,
        },
      });
    }));

    return notification;
  }
}