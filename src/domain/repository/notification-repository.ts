export default interface NotificationRepository {
  origin_id: string;
  user_id: string;
  image: string;
  title: string;
  body: string;
  viewed: boolean;
}