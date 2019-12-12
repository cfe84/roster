import { IEventStore } from "./IEventStore";
import { ISocket } from "./ISocket";
import { Message } from "./Message";

export interface ConnectionManagerDependencies {
  eventStore: IEventStore;
}

export class ConnectionManager {
  constructor(private deps: ConnectionManagerDependencies, private socket: ISocket) {
    this.socket.onAsync = this.on;
  }

  private on = async (eventType: string, message: Message): Promise<void> => {

  }
}