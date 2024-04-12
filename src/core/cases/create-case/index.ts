import { CaseId, CasesCreator, ClientGetter, Payload } from "./types";

export default class CreateCase {
  // private casesCreator: CasesCreator;

  // constructor(casesCreator: CasesCreator){
  //   this.casesCreator = casesCreator;
  // }
  constructor(private casesCreator: CasesCreator, private clientGetter: ClientGetter){}

  public async perform(payload: Payload): Promise<CaseId | null> {
    const {clientId, ...casePayload} = payload;

    const client = await this.clientGetter.get(clientId);

    if(!client) {
      return null;
    }

    return await this.casesCreator.createByUserId(clientId, {
      ...casePayload,
      status: 'pending',
      clientFullName: `${client.lastName}, ${client.firstName}`,
    })
  }
}
