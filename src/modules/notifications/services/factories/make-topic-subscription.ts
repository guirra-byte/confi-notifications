import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { TopicSubscription } from "../use-cases/topic-subscription";

export function makeTopicSubscription() {
  const notificationRepository = new MongooseNotificationRepository();
  return new TopicSubscription(notificationRepository);
}