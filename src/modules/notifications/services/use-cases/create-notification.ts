import mongoose from 'mongoose';
import { INotificationRepository } from "../../repository/INotificationRepository";
import { TopicNotificationModel, SubscriberNotificationModel } from "../../../../core/models";

interface CreateNotificationRequest {
  topicId: string;
  subject: string;
}

export class CreateNotification {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) { }

  async execute(data: CreateNotificationRequest) {
    const topicExists = await this.notificationRepository.findTopicById(data.topicId);
    if (!topicExists) {
      throw new Error("Topic not found");
    }

    const notification = await this.notificationRepository.create({
      topicId: data.topicId,
      subject: data.subject,
    });

    await TopicNotificationModel.create({
      topicId: new mongoose.Types.ObjectId(data.topicId),
      notificationId: notification._id,
    });

    const topicSubscriptions = await this.notificationRepository.findSubscribedTopic(data.topicId);
    if (!topicSubscriptions || topicSubscriptions.length === 0) {
      return notification;
    }

    await Promise.all(topicSubscriptions.map(async ({ subscriberId }) => {
      await SubscriberNotificationModel.create({
        subscriberId: new mongoose.Types.ObjectId(subscriberId.toString()),
        notificationId: notification._id,
      });
    }));

    return notification;
  }
}