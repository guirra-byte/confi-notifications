import { MongooseNotificationRepository } from "../../repository/mongoose/notification-repository";
import { NotifySubscribers } from "../use-cases/notify-subscribers";

function makeNotifySubscribers() {
  const notificationRepository = new MongooseNotificationRepository();
  return new NotifySubscribers(notificationRepository);
}

const notifySubscribers = makeNotifySubscribers();
export default notifySubscribers;