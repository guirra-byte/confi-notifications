import rabbitmq from "../../../../core/providers/rabbitmq";
import notifySubscribers from "../../services/factories/make-notify-subscribers";

interface NotifySubscribersRequest {
  topicId: string;
  notificationId: string;
}

export async function notifySubscribersConsumer() {
  console.log('Notify subscribers consumer is listening...');

  const rabbitmqClient = await rabbitmq;
  rabbitmqClient.channel.assertQueue('notify-subscriber', { durable: true });
  rabbitmqClient.channel.consume('notify-subscriber', async (message) => {
    if (message) {
      const { topicId, notificationId } = JSON.parse(message.content.toString()) as NotifySubscribersRequest;
      await notifySubscribers.notify(topicId, notificationId);
    }
  });
}

notifySubscribersConsumer();