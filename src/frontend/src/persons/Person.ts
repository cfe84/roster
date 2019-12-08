export type PersonId = string;

export interface Person {
  inTeamSince: Date | null;
  id: PersonId
  name: string,
  position: string,
  role: string,
  inCompanySince: Date | null,
  inPositionSince: Date | null
}