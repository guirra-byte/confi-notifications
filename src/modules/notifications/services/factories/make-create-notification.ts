import prisma from "../../../../core/providers/prisma";
import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { CreateNotification } from "../use-cases/create-notification";

export function makeCreateNotification() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new CreateNotification(notificationRepository, prisma);
}