import { FastifyInstance, FastifyReply } from "fastify";
import NotificationsController from "./notifications.controller";
import { 
  CreateNotificationRequest, 
  CreateTopicRequest, 
  DeleteNotificationsRequest, 
  FetchAllUserNotificationsRequest, 
  MarkAsReadRequest,
  NotifySubscribersRequest,
  TopicSubscriptionRequest,
  notificationsSchema 
} from "./notifications.schema";
import getRabbitMqClient from "../../../core/libs/rabbitmq";

export default async function NotificationsRoutes(app: FastifyInstance) {
  const rabbitmq = await getRabbitMqClient;
  const notificationsController = new NotificationsController(rabbitmq);

  // POST /notifications - Criar notificação
  app.post(
    '/',
    {
      schema: notificationsSchema.createNotification,
    },
    async (request: CreateNotificationRequest, reply: FastifyReply) => await notificationsController.createNotification(request, reply)
  );

  // POST /topics - Criar tópico
  app.post(
    '/topics',
    {
      schema: notificationsSchema.createTopic,
    },
    async (request: CreateTopicRequest, reply: FastifyReply) => await notificationsController.createTopic(request, reply)
  );

  // DELETE /notifications - Deletar notificações
  app.delete(
    '/notifications',
    {
      schema: notificationsSchema.deleteNotifications,
    },
    async (request: DeleteNotificationsRequest, reply: FastifyReply) => await notificationsController.deleteNotifications(request, reply)
  );

  // POST /notifications/search - Buscar notificações do usuário
  app.post(
    '/notifications/search',
    {
      schema: notificationsSchema.fetchAllUserNotifications,
    },
    async (request: FetchAllUserNotificationsRequest, reply: FastifyReply) => await notificationsController.fetchAllUserNotifications(request, reply)
  );

  // PATCH /notifications/read - Marcar notificações como lidas
  app.patch(
    '/notifications/read',
    {
      schema: notificationsSchema.markAsRead,
    },
    async (request: MarkAsReadRequest, reply: FastifyReply) => await notificationsController.markAsRead(request, reply)
  );

  // POST /notifications/notify - Disparar notificações para clientes SSE conectados (Fila RabbitMQ)
  app.post(
    '/notifications/notify',
    {
      schema: notificationsSchema.notifySubscribers,
    },
    async (request: NotifySubscribersRequest, reply: FastifyReply) => await notificationsController.notifySubscribers(request, reply)
  );

  // POST /topics/subscribe - Inscrever assinantes em um tópico
  app.post(
    '/topics/subscribe',
    {
      schema: notificationsSchema.topicSubscription,
    },
    async (request: TopicSubscriptionRequest, reply: FastifyReply) => await notificationsController.topicSubscription(request, reply)
  );
}

