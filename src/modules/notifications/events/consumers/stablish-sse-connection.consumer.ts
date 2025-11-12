import { FastifyReply } from "fastify";
import rabbitmq from "../../../../core/libs/rabbitmq";

// Just alias for notifySubscribers service
import sseHandler from "../../services/factories/make-notify-subscribers"; 

interface StablishSseConnectionRequest {
  subscriberId: string;
  originReply: FastifyReply;
}

export async function stablishSseConnectionConsumer() {
  console.log('Stablishing SSE connection consumer is listening...');
  
  const rabbitmqClient = await rabbitmq;
  rabbitmqClient.channel.assertQueue('notifications', { durable: true });
  rabbitmqClient.channel.consume('notifications', async (message) => {
    if (message) {
      const { subscriberId, originReply } = JSON.parse(message.content.toString()) as StablishSseConnectionRequest;
      await sseHandler.stablishSseConnection(subscriberId, originReply);
    }
  });
}

stablishSseConnectionConsumer();