export type ClientId = string;

export const MessageTypes = {
  HANDSHAKE: "handshake",
  COMMAND: "command",
  EVENT: "event"
}

export class Message<T> {
  constructor(public emitterId: ClientId, public payload: T) { }
}