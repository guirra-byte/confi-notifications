import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { DeleteNotifications } from "../use-cases/delete-notifications";

export function makeDeleteNotifications() {
  const notificationRepository = new MongooseNotificationRepository();
  return new DeleteNotifications(notificationRepository);
}
