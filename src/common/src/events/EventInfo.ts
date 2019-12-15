export type EmitterId = string;

export class EventInfo {
  public date: Date;
  constructor(public type: string, public objectType: string, public objectId: string, public emitterId?: string, public eventVersion: number = 1) {
    this.date = new Date(Date.now());
  }
}