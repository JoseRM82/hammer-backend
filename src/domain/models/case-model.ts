import { Schema, model, Model, SchemaTypes } from "mongoose";
import CaseRepository from "../repository/case-repository";

const Case = new Schema<CaseRepository, Model<CaseRepository>>({
  client_id: { type: String },
  client_name: { type: String },
  lawyer_id: { type: String },
  lawyer_name: { type: String },
  next_court: { type: Date },
  needed_files: { type: String },
  data: { type: SchemaTypes.Mixed },
  judgement_location: { type: Object },
  status: { type: String },
  start_date: { type: Date },
  end_date: { type: Date },
})

export default model('Cases', Case)