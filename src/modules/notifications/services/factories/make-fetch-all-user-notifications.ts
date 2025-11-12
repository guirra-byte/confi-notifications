import prisma from "../../../../core/providers/prisma";
import { FetchAllUserNotifications } from "../use-cases/fetch-all-user-notifications";

export function makeFetchAllUserNotifications() {
  return new FetchAllUserNotifications(prisma);
}