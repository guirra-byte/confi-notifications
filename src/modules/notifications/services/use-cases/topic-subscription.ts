import { INotificationRepository } from "../../repository/INotificationRepository";
import { PrismaClient } from "../../../../generated/prisma/client";
import { AlreadySubscribedError, TopicNotFoundError } from "../../errors";

interface ITopicSubscriptionRequest {
  domain: string;
  subscribers: { subId: string }[];
}

export class TopicSubscription {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly prisma: PrismaClient
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
            await this.subscribe(topicExists.domain, sub);
            resolve(true);
          } catch (error: unknown) {
            if (error instanceof AlreadySubscribedError) {
              reject({
                statusCode: error.statusCode,
                message: error.message,
                payload: { subId: sub.subId, topic: topicExists.id }
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

  private async subscribe(topic: string, { subId }: { subId: string }) {
    const topicSubscriptions = await this.notificationRepository.findSubscribedTopic(topic);
    if (!topicSubscriptions) {
      throw new TopicNotFoundError("Topic not found");
    }

    const subscriptionsMap = new Map<string, string>();
    topicSubscriptions.forEach(subscription => {
      subscriptionsMap.set(subscription.subscriberId, subscription.topicId);
    });

    if (subscriptionsMap.has(subId)) {
      throw new AlreadySubscribedError("Subscriber already subscribed to this topic");
    }

    const topicId = subscriptionsMap.get(subId)!;
    await this.prisma.subscriberTopic.create({
      data: {
        subscriberId: subId,
        topicId: topicId,
      },
    });
  };

  private async unsubscribe(topic: string, subId: string) {
    await this.prisma.subscriberTopic.deleteMany({
      where: { topicId: topic, subscriberId: subId },
    });
  };
}