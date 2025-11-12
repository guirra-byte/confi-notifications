import { INotificationRepository } from "../../repository/INotificationRepository";

export class MarkAsRead {
  constructor(private readonly notificationRepository: INotificationRepository) { }
  async execute(notificationIds: string[]) {
    await this.notificationRepository.markAsRead(notificationIds);
  }
}