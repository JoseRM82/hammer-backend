import { Schema, model, Model, SchemaTypes } from "mongoose";
import ClientRepository from "../repository/client-repository";

const Client = new Schema<ClientRepository, Model<ClientRepository>>({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  user_type: { type: String },
  password: { type: String },
  data: { type: SchemaTypes.Mixed },
  token: { type: String },
})

export default model('Clients', Client)