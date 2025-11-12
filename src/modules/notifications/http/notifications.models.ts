import { z } from "zod";

// Response Models
const notificationResponseModel = z.object({
  id: z.string().describe("ID da notificação"),
  subject: z.string().describe("Assunto da notificação"),
  topicId: z.string().describe("ID do tópico"),
  createdAt: z.coerce.date().describe("Data de criação"),
  updatedAt: z.coerce.date().describe("Data de atualização"),
});

const topicResponseModel = z.object({
  id: z.string().describe("ID do tópico"),
  domain: z.string().describe("Domínio do tópico"),
  description: z.string().optional().describe("Descrição do tópico"),
  createdAt: z.coerce.date().describe("Data de criação"),
  updatedAt: z.coerce.date().describe("Data de atualização"),
});

const messageResponseModel = z.object({
  message: z.string().describe("Mensagem de resposta"),
});

const notificationItemModel = z.object({
  id: z.string().describe("ID da notificação"),
  subject: z.string().describe("Assunto da notificação"),
  topicId: z.string().describe("ID do tópico"),
  createdAt: z.coerce.date().describe("Data de criação"),
  updatedAt: z.coerce.date().describe("Data de atualização"),
});

const paginatedNotificationsResponseModel = z.object({
  notifications: z.array(notificationItemModel).describe("Lista de notificações"),
  total: z.number().describe("Total de notificações"),
  page: z.number().describe("Página atual"),
  limit: z.number().describe("Limite de itens por página"),
});

export { notificationResponseModel, topicResponseModel, messageResponseModel, notificationItemModel, paginatedNotificationsResponseModel };