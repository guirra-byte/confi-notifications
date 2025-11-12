import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { CreateNotification } from "../use-cases/create-notification";

export function makeCreateNotification() {
  const notificationRepository = new MongooseNotificationRepository();
  return new CreateNotification(notificationRepository);
}