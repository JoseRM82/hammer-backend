import { Router } from "express";
import { CASE } from '../shared/constants/END_POINTS'
import CaseController from "../controllers/case-controller";

const caseController = new CaseController()

const {
  CREATE,
  SET_LAWYER,
  // GET_DATA,
  GET_CURRENT_CLIENT_CASES,
  GET_CURRENT_LAWYER_CASES,
  GET_PAST_CLIENT_CASES,
  GET_PAST_LAWYER_CASES,
  // UPDATE_DESCRIPTION,
  // FINISH_CASE,
} = CASE

const CaseRoutes = Router()

CaseRoutes.get(GET_CURRENT_CLIENT_CASES, caseController.getCurrentClientCases)
CaseRoutes.post(CREATE, caseController.create)
CaseRoutes.post(SET_LAWYER, caseController.setLawyer)
// CaseRoutes.get(GET_DATA, caseController.getCase)
CaseRoutes.get(GET_CURRENT_LAWYER_CASES, caseController.getCurrentLawyerCases)
CaseRoutes.get(GET_PAST_CLIENT_CASES, caseController.getPastClientCases)
CaseRoutes.get(GET_PAST_LAWYER_CASES, caseController.getPastLawyerCases)
// CaseRoutes.patch(UPDATE_DESCRIPTION, caseController.updateDescription)
// CaseRoutes.patch(FINISH_CASE, caseController.finishCase)

export default CaseRoutes