import prisma from "../../../../core/providers/prisma";
import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { CreateTopic } from "../use-cases/create-topic";

export function makeCreateTopic() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new CreateTopic(notificationRepository);
}