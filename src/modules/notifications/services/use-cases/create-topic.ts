import { INotificationRepository } from "../../repository/INotificationRepository";

interface CreateTopicRequest {
  domain: string;
  description?: string;
}

export class CreateTopic {
  constructor(private readonly notificationRepository: INotificationRepository) { }
  async execute(data: CreateTopicRequest) {
    try {
      const topic = await this.notificationRepository.createTopic(data);
      console.log('CreateTopic', topic);
      return topic;
    } catch (error) {
      console.error('Error in CreateTopic:', error);
      throw new Error('Failed to create topic');
    }
  }
}