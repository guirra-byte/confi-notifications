import { INotificationRepository } from "../../repository/INotificationRepository";

interface CreateTopicRequest {
  domain: string;
  description?: string;
}

export class CreateTopic {
  constructor(private readonly notificationRepository: INotificationRepository) { }

  async execute(data: CreateTopicRequest) {
    return await this.notificationRepository.createTopic(data);
  }
}