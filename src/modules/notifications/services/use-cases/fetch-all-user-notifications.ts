import mongoose from 'mongoose';
import { SubscriberTopicModel, NotificationModel, SubscriberNotificationModel } from "../../../../core/models";

interface FetchAllUserNotificationsRequest {
  subId: string;
  page?: number;
  limit?: number;
  options: {
    isRead?: boolean;
    isSent?: boolean;
    isDeleted?: boolean;
  };
}

export class FetchAllUserNotifications {
  async execute(data: FetchAllUserNotificationsRequest) {
    const subscriberTopics = await SubscriberTopicModel.find({
      subscriberId: new mongoose.Types.ObjectId(data.subId),
    });

    if (!subscriberTopics || subscriberTopics.length === 0) {
      return {
        notifications: [],
        total: 0,
        page: data.page ?? 1,
        limit: data.limit ?? 10,
      };
    }

    const topicIds = subscriberTopics.map(topic => topic.topicId);
    
    // Build query for notifications with filters
    const notificationQuery: any = { topicId: { $in: topicIds } };
    
    // Apply filters from SubscriberNotification
    if (data.options.isRead !== undefined || data.options.isSent !== undefined || data.options.isDeleted !== undefined) {
      const subscriberNotificationQuery: any = { subscriberId: new mongoose.Types.ObjectId(data.subId) };
      
      if (data.options.isRead !== undefined) {
        subscriberNotificationQuery.isRead = data.options.isRead;
      }
      if (data.options.isSent !== undefined) {
        subscriberNotificationQuery.isSent = data.options.isSent;
      }
      if (data.options.isDeleted !== undefined) {
        subscriberNotificationQuery.isDeleted = data.options.isDeleted;
      }

      const subscriberNotifications = await SubscriberNotificationModel.find(subscriberNotificationQuery);
      const notificationIds = subscriberNotifications.map(sn => sn.notificationId);
      
      if (notificationIds.length === 0) {
        return {
          notifications: [],
          total: 0,
          page: data.page ?? 1,
          limit: data.limit ?? 10,
        };
      }
      
      notificationQuery._id = { $in: notificationIds };
    }

    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      NotificationModel.find(notificationQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      NotificationModel.countDocuments(notificationQuery),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
    };
  }
}