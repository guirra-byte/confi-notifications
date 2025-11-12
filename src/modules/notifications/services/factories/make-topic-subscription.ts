import prisma from "../../../../core/providers/prisma";
import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { TopicSubscription } from "../use-cases/topic-subscription";

export function makeTopicSubscription() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new TopicSubscription(notificationRepository, prisma);
}