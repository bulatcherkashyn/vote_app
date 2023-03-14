export interface PushNotificationService {
  sendNotificationChangePollStatus(pollsData: Array<string>): Promise<void>

  sendNotificationAboutNewPoll(pollUIDs: Array<string>): Promise<void>
}
