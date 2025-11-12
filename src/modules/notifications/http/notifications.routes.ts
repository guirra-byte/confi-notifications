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
import getRabbitMqClient from "../../../core/providers/rabbitmq";

export default async function NotificationsRoutes(app: FastifyInstance) {
  const rabbitmq = await getRabbitMqClient;
  const notificationsController = new NotificationsController(rabbitmq);

  // POST /notifications - Criar notificação
  app.post(
    '/notifications',
    {
      schema: notificationsSchema.createNotification,
    },
    (request: CreateNotificationRequest, reply: FastifyReply) => notificationsController.createNotification(request, reply)
  );

  // POST /topics - Criar tópico
  app.post(
    '/topics',
    {
      schema: notificationsSchema.createTopic,
    },
    (request: CreateTopicRequest, reply: FastifyReply) => notificationsController.createTopic(request, reply)
  );

  // DELETE /notifications - Deletar notificações
  app.delete(
    '/notifications',
    {
      schema: notificationsSchema.deleteNotifications,
    },
    (request: DeleteNotificationsRequest, reply: FastifyReply) => notificationsController.deleteNotifications(request, reply)
  );

  // POST /notifications/search - Buscar notificações do usuário
  app.post(
    '/notifications/search',
    {
      schema: notificationsSchema.fetchAllUserNotifications,
    },
    (request: FetchAllUserNotificationsRequest, reply: FastifyReply) => notificationsController.fetchAllUserNotifications(request, reply)
  );

  // PATCH /notifications/read - Marcar notificações como lidas
  app.patch(
    '/notifications/read',
    {
      schema: notificationsSchema.markAsRead,
    },
    (request: MarkAsReadRequest, reply: FastifyReply) => notificationsController.markAsRead(request, reply)
  );

  // POST /notifications/notify - Disparar notificações para clientes SSE conectados (Fila RabbitMQ)
  app.post(
    '/notifications/notify',
    {
      schema: notificationsSchema.notifySubscribers,
    },
    (request: NotifySubscribersRequest, reply: FastifyReply) => notificationsController.notifySubscribers(request, reply)
  );

  // POST /topics/subscribe - Inscrever assinantes em um tópico
  app.post(
    '/topics/subscribe',
    {
      schema: notificationsSchema.topicSubscription,
    },
    (request: TopicSubscriptionRequest, reply: FastifyReply) => notificationsController.topicSubscription(request, reply)
  );
}

