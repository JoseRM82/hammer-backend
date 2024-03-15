import { Schema, model, Model } from "mongoose";
import RequestRepository from "../repository/request-repository";

const Request = new Schema<RequestRepository, Model<RequestRepository>>({
  case_id: { type: String },
  lawyer_id: { type: String },
  client_id: { type: String },
  lawyer_name: { type: String },
  client_name: { type: String },
  case_languages: { type: String },
  case_location: { type: String },
  case_type: { type: String },
  case_description: { type: String },
  sent_date: { type: Date },
})

export default model('Requests', Request)