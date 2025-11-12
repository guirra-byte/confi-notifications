import { INotificationRepository } from "../../repository/INotificationRepository";

interface DeleteNotificationsRequest {
  ids: string[];
}

export class DeleteNotifications {
  constructor(private readonly notificationRepository: INotificationRepository) { }
  async execute(data: DeleteNotificationsRequest) {
    return await this.notificationRepository.markAsDeleted(data.ids);
  }
}