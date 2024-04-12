type Country = 'arg' | 'per' | 'ch';
type Lang = 'es' | 'en';

export interface Payload { // Input
  clientId: string; // clientId
  type: string;
  country: Country;
  lang: Lang;
  description: string;
}

export interface CasePayload {
  type: string;
  country: Country;
  lang: Lang;
  description: string;
  status: 'pending' | 'on_going' | 'finished';
  clientFullName: string;
}

// interface CasesRepository {
//   create: (payload: CasePayload) => number; // () => id
// }

export type CaseId = string;

export interface CasesCreator {
  createByUserId: (userId: string, payload: CasePayload) => Promise<CaseId>;
  // createByUserEmail: (mail: string, payload: CasePayload) => number; // () => id
}

export interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
}

export interface ClientGetter {
  get: (userId: string) => Promise<ClientData | null>;
}
