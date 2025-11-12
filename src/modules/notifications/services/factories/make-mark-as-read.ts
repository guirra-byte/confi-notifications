import prisma from "../../../../core/providers/prisma";
import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { MarkAsRead } from "../use-cases/mark-as-read";

export function makeMarkAsRead() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new MarkAsRead(notificationRepository);
}