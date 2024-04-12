import CreateCase from "../../../core/cases/create-case";
import CaseModel from "../../../domain/models/case-model";
import ClientModel from "../../../domain/models/client-model";
import CasesCreator from "../../../providers/cases/create-case/cases-creator";
import ClientGetter from "../../../providers/cases/create-case/client-getter";

export default class CompositionRoot {
  public static getUseCase(): CreateCase {
    const casesCreator = new CasesCreator(CaseModel);

    const clientGetter = new ClientGetter(ClientModel)

    return new CreateCase(
      casesCreator,
      clientGetter,
    )
  }
}
