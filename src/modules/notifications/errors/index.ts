import { AppError } from "../../../core/errors/app-error";

export class TopicNotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class AlreadySubscribedError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotificationSenderError extends AppError {
  constructor(message: string, subscriberId: string) {
    super(`Error sending notification to subscriber ${subscriberId}: ${message}`, 500);
  }
}

export class RabbitMqMessageNotSentError extends AppError {
  constructor(message: string) {
    super(`Error sending message to RabbitMQ: ${message}`, 500);
  }
}