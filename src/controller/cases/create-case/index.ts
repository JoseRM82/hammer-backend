import { Payload } from "../../../core/cases/create-case/types";
import { network_error, network_success, server_error } from "../../../middlewares/network-middleware";
import { ERROR_CODES } from "../../../shared/constants/ERROR_CODES";
import CompositionRoot from "./composition-root";

// export default class CreateCaseController {
//   public static async execute(payload: Payload): Promise<string | null> {
//     const useCase = CompositionRoot.getUseCase();

//     return await useCase.perform(payload);
//   }
// }

// service

export async function createCaseService(req, res) {
  const { country, description, lang, type } = req.body;

  const payload: Payload = {
    clientId: req.userId,
    country,
    description,
    lang,
    type,
  }

  try {
    const useCase = CompositionRoot.getUseCase();

    const result = await useCase.perform(payload);
    
    if(!result) {
      return network_error({}, 400, res, 'Client does not exist', ERROR_CODES.REQUEST_ERRORS.NOT_FOUND)
    }

    return network_success(result, 200, res, 'Case created successfully')
  } catch (error) {
    console.error(error)
    return server_error(500, res, error)
  }
}

function handleErrors(error: string) {
  if(error === 'external error'){
    return {
      status: 404,
      success: false,
    }
  }
}
