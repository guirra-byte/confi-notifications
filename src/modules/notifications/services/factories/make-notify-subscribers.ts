import { PrismaNotificationRepository } from "../../repository/prisma/notification-repository";
import { NotifySubscribers } from "../use-cases/notify-subscribers";
import prisma from "../../../../core/providers/prisma";

function makeNotifySubscribers() {
  const notificationRepository = new PrismaNotificationRepository(prisma);
  return new NotifySubscribers(prisma, notificationRepository);
}

const notifySubscribers = makeNotifySubscribers();
export default notifySubscribers;