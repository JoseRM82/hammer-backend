import { Router } from "express";
import { NOTE } from '../shared/constants/END_POINTS'
import NoteController from "../controllers/note-controller";

const noteController = new NoteController()

const {
  CREATE,
  GET_NOTES,
  DELETE_NOTE,
} = NOTE

const CitationRoutes = Router()

CitationRoutes.post(CREATE, noteController.create)
CitationRoutes.get(GET_NOTES, noteController.getNotes)
CitationRoutes.post(DELETE_NOTE, noteController.deleteNote)

export default CitationRoutes