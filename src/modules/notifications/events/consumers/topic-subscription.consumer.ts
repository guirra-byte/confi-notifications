import rabbitmq from "../../../../core/providers/rabbitmq";
import { makeTopicSubscription } from "../../services/factories/make-topic-subscription";

interface TopicSubscriptionRequest {
  domain: string;
  subscribers: { subId: string, subject: string }[];
}

export async function topicSubscriptionConsumer() {
  console.log('Topic subscription consumer is listening...');
  
  const rabbitmqClient = await rabbitmq;
  rabbitmqClient.channel.assertQueue('topic-subscription', { durable: true });
  rabbitmqClient.channel.consume('topic-subscription', async (message) => {
    if (message) {
      const { domain, subscribers } = JSON.parse(message.content.toString()) as TopicSubscriptionRequest;
      const topicSubscription = makeTopicSubscription();
      await topicSubscription.execute([{ domain, subscribers }]);
    }
  });
}

topicSubscriptionConsumer();