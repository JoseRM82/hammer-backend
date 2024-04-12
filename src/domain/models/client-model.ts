import { Schema, model, Model, SchemaTypes } from "mongoose";
import ClientRepository from "../repository/client-repository";

const Client = new Schema<ClientRepository, Model<ClientRepository>>({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  password: { type: String },
  data: { type: SchemaTypes.Mixed },
  token: { type: String },
})

const ClientModel =  model('Clients', Client)
export type IClientModel = typeof ClientModel;
export default ClientModel;
