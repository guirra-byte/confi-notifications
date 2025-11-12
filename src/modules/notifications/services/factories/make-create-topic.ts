import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { CreateTopic } from "../use-cases/create-topic";

export function makeCreateTopic() {
  const notificationRepository = new MongooseNotificationRepository();
  return new CreateTopic(notificationRepository);
}