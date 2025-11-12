import amqp from "amqplib";
import { config } from "dotenv";

config();

const { RABBITMQ_URL } = process.env;

let rabbitmqConnection: amqp.ChannelModel | null = null;
let rabbitmqChannel: amqp.Channel | null = null;

const getRabbitMqClient = async () => {
  if (!rabbitmqConnection || !rabbitmqChannel) {
    if (!RABBITMQ_URL) {
      throw new Error('RABBITMQ_URL is not defined in the environment variables');
    }

    try {
      rabbitmqConnection = await amqp.connect(RABBITMQ_URL);
      rabbitmqChannel = await rabbitmqConnection.createChannel();

      const gracefulShutdown = async () => {
        console.log('Closing RabbitMQ connection...');
        await rabbitmqChannel?.close();
        await rabbitmqConnection?.close();
        process.exit(0);
      };

      process.on('beforeExit', gracefulShutdown);
      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);

      rabbitmqConnection.on('error', (err) => {
        console.error('RabbitMQ Connection Error:', err);
        process.exit(1);
      });
    } catch (err) {
      console.error('Failed to connect to RabbitMQ:', err);
      process.exit(1);
    }
  }

  return { connection: rabbitmqConnection, channel: rabbitmqChannel };
};

export default getRabbitMqClient();