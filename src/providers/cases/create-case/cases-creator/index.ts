import { CaseId, CasePayload, CasesCreator as ICasesCreator } from "../../../../core/cases/create-case/types";
import { ICaseModel } from "../../../../domain/models/case-model";
import { CaseCreatedResponse } from "./types";

export default class CasesCreator implements ICasesCreator {
  constructor(private caseModel: ICaseModel){}

  public async createByUserId(userId: string, payload: CasePayload): Promise<CaseId> {
    const newCaseData = this.getCaseData(userId, payload);

    const newCase = new this.caseModel(newCaseData)
    
    try {
      const {_id}: CaseCreatedResponse = await newCase.save();

      return _id;
    } catch (error) {
      throw 'External error. Error inserting new Case document on MongoDB'
    }
  };

  private getCaseData(userId: string, payload: CasePayload) {
    const {clientFullName, status, ...caseData} = payload;

    return {
      client_id: userId,
      client_name: clientFullName,
      next_court: [{
        citation: '',
        date: '',
      }],
      needed_files: {
        files_types: [],
        files_url: [{
          name: '',
          url: '',
          key: '',
        }],
      },
      judgement_location: {
        court_adress: ''
      },
      start_date: new Date(),
      end_date: '',
      status,
      data: caseData,
    }
  }
}
