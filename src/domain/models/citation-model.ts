import { Schema, model, Model } from "mongoose";
import CitationRepository from '../repository/citation-repository'

const Citation = new Schema<CitationRepository, Model<CitationRepository>>({
  lawyer_id: {type: String},
  client_id: {type: String},
  case_id: {type: String},
  year: {type: Number},
  month: {type: Number},
  date: {type: Number},
  hour: {type: Number},
  minutes: {type: Number},
  description: {type: String},
})

export default model('Citations', Citation)