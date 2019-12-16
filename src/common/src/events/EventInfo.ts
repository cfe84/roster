import { GUID } from "../utils/guid";

export type EmitterId = string;

export class EventInfo {
  public date: Date;
  public eventId: string;
  constructor(public type: string, public objectType: string, public objectId: string, public emitterId?: string, public eventVersion: number = 1) {
    this.date = new Date(Date.now());
    this.eventId = GUID.newGuid();
  }
}