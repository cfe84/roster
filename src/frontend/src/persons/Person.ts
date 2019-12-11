export type PersonId = string;

export interface Person {
  inTeamSince?: Date;
  id: PersonId
  name: string,
  position: string,
  role: string,
  inCompanySince?: Date,
  inPositionSince?: Date
}