import { z } from "zod";
import { FastifyRequest } from "fastify";
import { messageResponseModel, notificationResponseModel, paginatedNotificationsResponseModel, topicResponseModel } from "./notifications.models";

// Error Schema comum
const errorSchema = z.object({
  message: z.string().describe("Mensagem de erro"),
  statusCode: z.number().describe("Código de status"),
});

// Schemas de validação
export const notificationsSchema = {
  createNotification: {
    summary: "Criar notificação",
    description: "Cria uma nova notificação para um tópico específico e notifica os assinantes.",
    tags: ["Notificações"],
    body: z.object({
      topicId: z.string().describe("ID do tópico"),
      subject: z.string().describe("Assunto da notificação"),
    }),
    response: {
      201: notificationResponseModel,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  createTopic: {
    summary: "Criar tópico",
    description: "Cria um novo tópico de notificações.",
    tags: ["Notificações"],
    body: z.object({
      domain: z.string().describe("Domínio do tópico"),
      description: z.string().optional().describe("Descrição do tópico"),
    }),
    response: {
      201: topicResponseModel,
      400: errorSchema,
      500: errorSchema,
    },
  },

  deleteNotifications: {
    summary: "Deletar notificações",
    description: "Marca notificações como deletadas pelo seus IDs.",
    tags: ["Notificações"],
    body: z.object({
      ids: z.array(z.string()).describe("Array de IDs das notificações"),
    }),
    response: {
      200: messageResponseModel,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  fetchAllUserNotifications: {
    summary: "Listar notificações do usuário",
    description: "Retorna uma lista paginada de notificações do usuário com filtros avançados.",
    tags: ["Notificações"],
    body: z.object({
      subId: z.string().describe("ID do assinante"),
      page: z.number().optional().describe("Número da página"),
      limit: z.number().optional().describe("Limite de itens por página"),
      options: z.object({
        isRead: z.boolean().optional().describe("Filtrar por notificações lidas"),
        isSent: z.boolean().optional().describe("Filtrar por notificações enviadas"),
        isDeleted: z.boolean().optional().describe("Filtrar por notificações deletadas"),
      }).describe("Opções de filtro"),
    }),
    response: {
      200: paginatedNotificationsResponseModel,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  markAsRead: {
    summary: "Marcar como lida",
    description: "Marca notificações como lidas pelos seus IDs.",
    tags: ["Notificações"],
    body: z.object({
      notificationIds: z.array(z.string()).describe("Array de IDs das notificações"),
    }),
    response: {
      200: messageResponseModel,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },

  notifySubscribers: {
    summary: "Enviar notificação para fila",
    description: "Envia uma notificação para a fila do RabbitMQ para processamento assíncrono.",
    tags: ["Notificações"],
    body: z.object({
      topicId: z.string().describe("ID do tópico"),
      notificationId: z.string().describe("ID da notificação"),
    }),
    response: {
      200: messageResponseModel,
      400: errorSchema,
      500: errorSchema,
    },
  },

  topicSubscription: {
    summary: "Inscrever em tópico",
    description: "Envia solicitação de inscrição de assinantes em um tópico para a fila do RabbitMQ.",
    tags: ["Notificações"],
    body: z.object({
      domain: z.string().describe("Domínio do tópico"),
      subscribers: z.array(
        z.object({
          subId: z.string().describe("ID do assinante"),
        })
      ).describe("Lista de assinantes"),
    }),
    response: {
      200: messageResponseModel,
      400: errorSchema,
      500: errorSchema,
    },
  },
};

// Request Types
export type CreateNotificationRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.createNotification.body>;
}>;

export type CreateTopicRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.createTopic.body>;
}>;

export type DeleteNotificationsRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.deleteNotifications.body>;
}>;

export type FetchAllUserNotificationsRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.fetchAllUserNotifications.body>;
}>;

export type MarkAsReadRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.markAsRead.body>;
}>;

export type NotifySubscribersRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.notifySubscribers.body>;
}>;

export type TopicSubscriptionRequest = FastifyRequest<{
  Body: z.infer<typeof notificationsSchema.topicSubscription.body>;
}>;
