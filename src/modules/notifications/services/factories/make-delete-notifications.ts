import prisma from "../../../../core/providers/prisma";
import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { DeleteNotifications } from "../use-cases/delete-notifications";

export function makeDeleteNotifications() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new DeleteNotifications(notificationRepository);
}
