import { Router } from "express";
import { CITATION } from '../shared/constants/END_POINTS'
import CitationController from "../controllers/citation-controller";

const citationController = new CitationController()

const {
  CREATE,
  GET_CITATION,
  UPDATE_CITATION,
  DELETE_CITATION,
  GET_CASE_CITATIONS,
  GET_MONTH_CITATIONS,
  GET_DATE_CITATIONS,
} = CITATION

const CitationRoutes = Router()

CitationRoutes.post(CREATE, citationController.create)
CitationRoutes.get(GET_CITATION, citationController.getCitation)
CitationRoutes.post(UPDATE_CITATION, citationController.updateCitation)
CitationRoutes.post(DELETE_CITATION, citationController.deleteCitation)
CitationRoutes.get(GET_CASE_CITATIONS, citationController.getCaseCitations)
CitationRoutes.get(GET_MONTH_CITATIONS, citationController.getMonthCitations)
CitationRoutes.get(GET_DATE_CITATIONS, citationController.getDateCitations)

export default CitationRoutes