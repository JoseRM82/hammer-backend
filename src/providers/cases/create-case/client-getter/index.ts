import { ClientData, ClientGetter } from "../../../../core/cases/create-case/types";
import { IClientModel } from "../../../../domain/models/client-model";
import { ClientRawResponse } from "./types";

export default class implements ClientGetter {
  constructor(private clientModel: IClientModel){}
  
  async get(userId: string): Promise<ClientData | null> {
    let client: ClientRawResponse | null = null;

    try {
      client = await this.clientModel.findOne({ _id: userId })
    } catch (error) {
      console.error(error);
      throw new Error('External error. Error getting client from mongodb');
    }

    if(!client) {
      return null;
    }

    return {
      id: client._id,
      firstName: client.first_name,
      lastName: client.last_name,
    }
  }
}
