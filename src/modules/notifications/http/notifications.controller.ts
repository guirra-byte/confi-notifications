import { FastifyReply } from "fastify";
import { Channel, ChannelModel } from "amqplib";
import { makeCreateNotification } from "../services/factories/make-create-notification";
import { makeCreateTopic } from "../services/factories/make-create-topic";
import { makeDeleteNotifications } from "../services/factories/make-delete-notifications";
import { makeFetchAllUserNotifications } from "../services/factories/make-fetch-all-user-notifications";
import { makeMarkAsRead } from "../services/factories/make-mark-as-read";
import {
  CreateNotificationRequest,
  CreateTopicRequest,
  DeleteNotificationsRequest,
  FetchAllUserNotificationsRequest,
  MarkAsReadRequest,
  NotifySubscribersRequest,
  TopicSubscriptionRequest,
} from "./notifications.schema";
import { AppError } from "../../../core/errors/app-error";
import { RabbitMqMessageNotSentError } from "../errors";

interface RabbitMqClient {
  channel: Channel;
  connection: ChannelModel;
}

export default class NotificationsController {
  constructor(private readonly rabbitmq: RabbitMqClient) { }
  async notifySubscribers(request: NotifySubscribersRequest, reply: FastifyReply) {
    try {
      const { topicId, notificationId } = request.body;
      reply.status(200).send({ message: 'Notification sent' });

      const confirmChannel = await this.rabbitmq.connection.createConfirmChannel();
      confirmChannel.assertQueue('notify-subscriber', { durable: true });

      const wasSent = confirmChannel.sendToQueue('notify-subscriber', Buffer.from(JSON.stringify({ topicId, notificationId })));
      if (!wasSent) {
        throw new RabbitMqMessageNotSentError(`[NOTIFY_SUBSCRIBER][topicId: ${topicId}, notificationId: ${notificationId}]`);
      }

    }
    catch (error) {
      console.error('Error in notifySubscribers:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao enviar notificação para fila.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async topicSubscription(request: TopicSubscriptionRequest, reply: FastifyReply) {
    try {
      const { domain, subscribers } = request.body;
      reply.status(200).send({ message: 'Topic subscription sent' });

      const confirmChannel = await this.rabbitmq.connection.createConfirmChannel();
      this.rabbitmq.channel.assertQueue('topic-subscription', { durable: true });

      const wasSent = confirmChannel.sendToQueue('topic-subscription', Buffer.from(JSON.stringify({ domain, subscribers })));
      if (!wasSent) {
        throw new RabbitMqMessageNotSentError(`[TOPIC_SUBSCRIPTION][domain: ${domain}, subscribers: ${subscribers.map(sub => sub.subId).join(', ')}]`);
      }

    }
    catch (error) {
      console.error('Error in topicSubscription:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao processar inscrição no tópico.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async createNotification(request: CreateNotificationRequest, reply: FastifyReply) {
    try {
      const { topicId, subject } = request.body;
      const notification = await makeCreateNotification().execute({ topicId, subject });
      return reply.status(201).send(notification);
    }
    catch (error) {
      console.error('Error in createNotification:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao criar notificação.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async createTopic(request: CreateTopicRequest, reply: FastifyReply) {
    try {
      const { domain, description } = request.body;
      const topic = await makeCreateTopic().execute({
        domain,
        ...(description !== undefined && { description })
      });

      return reply.status(201).send(topic);
    }
    catch (error) {
      console.error('Error in createTopic:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao criar tópico.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async deleteNotifications(request: DeleteNotificationsRequest, reply: FastifyReply) {
    try {
      const { ids } = request.body;
      await makeDeleteNotifications().execute({ ids });
      return reply.status(200).send({ message: 'Notifications deleted successfully' });
    }
    catch (error) {
      console.error('Error in deleteNotifications:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao deletar notificações.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async fetchAllUserNotifications(request: FetchAllUserNotificationsRequest, reply: FastifyReply) {
    try {
      const { subId, page, limit, options } = request.body;

      const notifications = await makeFetchAllUserNotifications().execute({
        subId,
        options: {
          ...(options.isRead !== undefined && { isRead: options.isRead }),
          ...(options.isSent !== undefined && { isSent: options.isSent }),
          ...(options.isDeleted !== undefined && { isDeleted: options.isDeleted }),
        },
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { limit })
      });

      return reply.status(200).send(notifications);
    }
    catch (error) {
      console.error('Error in fetchAllUserNotifications:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao buscar notificações do usuário.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }

  async markAsRead(request: MarkAsReadRequest, reply: FastifyReply) {
    try {
      const { notificationIds } = request.body;
      await makeMarkAsRead().execute(notificationIds);
      return reply.status(200).send({ message: 'Notifications marked as read successfully' });
    }
    catch (error) {
      console.error('Error in markAsRead:', error);

      if (error instanceof AppError) {
        return reply.status(error.statusCode).send({
          status: false,
          message: error.message,
        });
      }

      return reply.status(500).send({
        status: false,
        message: 'Erro interno do servidor ao marcar notificações como lidas.',
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}