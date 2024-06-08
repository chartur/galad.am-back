export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  data?: {
    link?: string;
  };
}
