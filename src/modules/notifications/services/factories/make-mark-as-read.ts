import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { MarkAsRead } from "../use-cases/mark-as-read";

export function makeMarkAsRead() {
  const notificationRepository = new MongooseNotificationRepository();
  return new MarkAsRead(notificationRepository);
}