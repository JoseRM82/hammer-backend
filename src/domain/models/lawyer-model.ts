import { Schema, model, Model, SchemaTypes } from "mongoose";
import LawyerRepository from "../repository/lawyer-repository";

const Lawyer = new Schema<LawyerRepository, Model<LawyerRepository>>({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  user_type: { type: String },
  password: { type: String },
  data: { type: SchemaTypes.Mixed },
  token: { type: String },
})

export default model('Lawyers', Lawyer)