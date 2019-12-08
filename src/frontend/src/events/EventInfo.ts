export class EventInfo {
  public date: Date;
  constructor(public type: string) {
    this.date = new Date(Date.now());
  }
}