import { FastifyReply } from "fastify";
import { PrismaClient } from "../../../../generated/prisma/client";
import { NotificationSenderError } from "../../errors";
import { INotificationRepository } from "../../repository/INotificationRepository";

const corsHeaders: { key: string; value: string }[] = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  { key: "Access-Control-Allow-Methods", value: "*" },
];
const sseHeaders: { key: string; value: string }[] = [
  { key: "Content-Type", value: "text/event-stream" },
  { key: "Cache-Control", value: "no-cache" },
  { key: "Connection", value: "keep-alive" },
];

class SseHandler {
  protected static sseClients: Map<string, FastifyReply> = new Map();
  protected handleSseConnection(subscriberId: string, originReply: FastifyReply) {
    const rawHeaders = [...corsHeaders, ...sseHeaders];
    rawHeaders.forEach(({ key, value }) => {
      originReply.raw.setHeader(key, value);
    });

    const hasActiveSseConnection = SseHandler.sseClients.has(subscriberId);
    if (!hasActiveSseConnection) {
      SseHandler.sseClients.set(subscriberId, originReply);

      originReply.raw.on("close", () => {
        const connectionRegistry = SseHandler.sseClients.has(subscriberId);
        if (connectionRegistry) {
          SseHandler.sseClients.delete(subscriberId);
        }
      });

      originReply.raw.write(
        `data: Connection with SSE for subscriber ${subscriberId} has been stablished!\n\n`
      );
    }
  }
}

export class NotifySubscribers extends SseHandler {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly notificationRepository: INotificationRepository,
  ) { 
    super();
  }

  async stablishSseConnection(subscriberId: string, originReply: FastifyReply) {
    const subscriber = await this.prisma.subscriber.findUnique({
      where: { id: subscriberId },
    });

    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    this.handleSseConnection(subscriberId, originReply);
  }

  async notify(topicId: string, notificationId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    const [subscribers, notification] = await Promise.all([
      this.prisma.subscriberTopic.findMany({
        where: { topicId: topicId },
      }),
      this.notificationRepository.findById(notificationId)
    ]);

    if (!subscribers) {
      throw new Error("No subscribers found for this topic");
    }

    if (!notification) {
      throw new Error("Notification not found");
    }

    const connectedSubscribers = Array.from(SseHandler.sseClients.keys());
    const notificationsOnPromises = connectedSubscribers.map(async (subId) => {
      return new Promise(async (resolve, reject) => {
        try {
          const client = SseHandler.sseClients.get(subId);

          if (client) {
            console.log(`Sending notification to subscriber ${subId}: ${topic.domain} - ${notification.subject}`);
            client.raw.write(`data: ${notification.subject}\n\n`, (err: Error | null | undefined) => {
              if (err) {
                throw new NotificationSenderError(err.message, subId);
              }
            });

            resolve({ notificationId: notification.id });
          }
        }
        catch (error: unknown) {
          if (error instanceof NotificationSenderError) {
            console.error(`Error sending notification to subscriber ${error.message}`);
            reject(error);
          }
        }
      })
    });

    await Promise.allSettled(notificationsOnPromises).then(results => {
      results.map(async (result) => {
        if (result.status === "fulfilled") {
          const { notificationId } = result.value as { notificationId: string };
          await this.notificationRepository.markAsSent([notificationId]);
        }
      });
    });
  }
}