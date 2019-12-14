export type EmitterId = string;

export class EventInfo {
  public date: Date;
  constructor(public type: string, public emitterId?: string) {
    this.date = new Date(Date.now());
  }
}