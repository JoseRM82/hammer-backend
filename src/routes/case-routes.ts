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
  GET_NEEDED_FILES,
  UPDATE_NEEDED_FILES,
  DELETE_NEEDED_FILE,
  UPLOAD_FILE,
  DELETE_FILE_S3,
  DOWNLOAD_FILE,
  // UPDATE_DESCRIPTION,
  // FINISH_CASE,
} = CASE

const CaseRoutes = Router()

CaseRoutes.post(CREATE, caseController.create)
CaseRoutes.post(SET_LAWYER, caseController.setLawyer)
// CaseRoutes.get(GET_DATA, caseController.getCase)
CaseRoutes.get(GET_CURRENT_CLIENT_CASES, caseController.getCurrentClientCases)
CaseRoutes.get(GET_CURRENT_LAWYER_CASES, caseController.getCurrentLawyerCases)
CaseRoutes.get(GET_NEEDED_FILES, caseController.getNeededFiles)
CaseRoutes.post(UPDATE_NEEDED_FILES, caseController.updateNeededFiles)
CaseRoutes.post(DELETE_NEEDED_FILE, caseController.deleteNeededFile)
CaseRoutes.post(DELETE_FILE_S3, caseController.deleteFileFromS3)
CaseRoutes.get(DOWNLOAD_FILE, caseController.downloadFile)
CaseRoutes.post(UPLOAD_FILE, caseController.uploadFile)
CaseRoutes.get(GET_PAST_CLIENT_CASES, caseController.getPastClientCases)
CaseRoutes.get(GET_PAST_LAWYER_CASES, caseController.getPastLawyerCases)
// CaseRoutes.patch(UPDATE_DESCRIPTION, caseController.updateDescription)
// CaseRoutes.patch(FINISH_CASE, caseController.finishCase)

export default CaseRoutes