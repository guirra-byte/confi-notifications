import { PrismaClient } from "../../../../generated/prisma/client";

interface FetchAllUserNotificationsRequest {
  subId: string;
  page?: number;
  limit?: number;
  options: {
    isRead?: boolean;
    isSent?: boolean;
    isDeleted?: boolean;
  };
}

export class FetchAllUserNotifications {
  constructor(private readonly prisma: PrismaClient) { }
  async execute(data: FetchAllUserNotificationsRequest) {
    const subscriberTopics = await this.prisma.subscriberTopic.findMany({
      where: { subscriberId: data.subId },
    });

    if (!subscriberTopics) {
      return [];
    }

    const topicIds = subscriberTopics.map(topic => topic.topicId);
    const notifications = await this.prisma.notification.findMany({
      where: { topicId: { in: topicIds }, ...data.options },
      orderBy: { createdAt: "desc" },
      skip: (data.page ?? 1 - 1) * (data.limit ?? 10),
      take: data.limit ?? 10,
    });

    return {
      notifications,
      total: notifications.length,
      page: data.page ?? 1,
      limit: data.limit ?? 10,
    };
  }
}