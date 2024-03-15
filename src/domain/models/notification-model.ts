import { Schema, model, Model } from "mongoose";
import NotificationRepository from "../repository/notification-repository";

const Notification = new Schema<NotificationRepository, Model<NotificationRepository>>({
  origin_id: { type: String },
  user_id: { type: String },
  image: { type: String },
  title: { type: String },
  body: { type: String },
  viewed: { type: Boolean },
})

export default model('Notifications', Notification)