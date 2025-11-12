import mongoose from 'mongoose';
import { INotificationRepository } from "../../repository/INotificationRepository";
import { SubscriberTopicModel } from "../../../../core/models";
import { AlreadySubscribedError, TopicNotFoundError } from "../../errors";

interface ITopicSubscriptionRequest {
  domain: string;
  subscribers: { subId: string }[];
}

export class TopicSubscription {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) { }

  async execute(data: ITopicSubscriptionRequest[]) {
    const topics = data.map(async item => {
      const topicExists = await this.notificationRepository.findTopicByDomain(item.domain);
      if (!topicExists) {
        throw new Error("Topic not found");
      }

      const dispatchSubscriptions = item.subscribers.map(async sub => {
        return new Promise(async (resolve, reject) => {
          try {
            await this.subscribe(topicExists._id.toString(), sub);
            resolve(true);
          } catch (error: unknown) {
            if (error instanceof AlreadySubscribedError) {
              reject({
                statusCode: error.statusCode,
                message: error.message,
                payload: { subId: sub.subId, topic: topicExists._id.toString() }
              });
            }
          }
        })
      });

      await Promise.allSettled(dispatchSubscriptions).then(results => {
        results.map(async result => {
          if (result.status === "rejected") {
            const { statusCode, message, payload } = result.reason as { statusCode: number, message: string, payload: { subId: string, topic: string } };
            if (statusCode === 400 && message === "Subscriber already subscribed to this topic") {
              await this.unsubscribe(payload.topic, payload.subId);
            }
          }
        });
      });
    });

    await Promise.all(topics);
  }

  private async subscribe(topicId: string, { subId }: { subId: string }) {
    const topicSubscriptions = await this.notificationRepository.findSubscribedTopic(topicId);
    if (!topicSubscriptions) {
      throw new TopicNotFoundError("Topic not found");
    }

    const subscriptionsMap = new Map<string, string>();
    topicSubscriptions.forEach(subscription => {
      subscriptionsMap.set(subscription.subscriberId.toString(), subscription.topicId.toString());
    });

    if (subscriptionsMap.has(subId)) {
      throw new AlreadySubscribedError("Subscriber already subscribed to this topic");
    }

    await SubscriberTopicModel.create({
      subscriberId: new mongoose.Types.ObjectId(subId),
      topicId: new mongoose.Types.ObjectId(topicId),
    });
  };

  private async unsubscribe(topicId: string, subId: string) {
    await SubscriberTopicModel.deleteMany({
      topicId: new mongoose.Types.ObjectId(topicId),
      subscriberId: new mongoose.Types.ObjectId(subId),
    });
  };
}