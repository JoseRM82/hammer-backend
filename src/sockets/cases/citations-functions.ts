import ClientModel from "../../domain/models/client-model"
import LawyerModel from "../../domain/models/lawyer-model"
import CaseModel from "../../domain/models/case-model"

export const createCitation = async(data: Record<string, any>) => {
  try {
    const {case_id, other_person_id, date, note} = data
    const caseToUpdate = await CaseModel.findOne({_id: case_id})

    if(!caseToUpdate) return {success: false}

    const citationCreated = await CaseModel.updateOne({_id: case_id}, {$set: {'next_court': {date: [...caseToUpdate.next_court![date], {note: note}]}}})

    if(!citationCreated) return {success: false}

    return {success: true}

  } catch(error) {
    return {success: false}
  }
}