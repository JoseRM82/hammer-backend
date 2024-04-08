import { Schema, model, Model, SchemaTypes } from "mongoose";
import NoteRepository from '../repository/note-repository'

const Note = new Schema<NoteRepository, Model<NoteRepository>>({
  user_id: {type: String},
  notes: {type: SchemaTypes.Mixed},
})

export default model('Notes', Note)