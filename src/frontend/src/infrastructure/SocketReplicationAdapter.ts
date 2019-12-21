import { IReplicationAdapter } from "../synchronization/IReplicationAdapter";
import { IEvent } from "../../lib/common/events";
import io from "socket.io-client";
import { Message, MessageTypes, SocketConnectionParameters, EventReceivedAck } from "../../lib/common/message/";
import { ILocalStorage } from "./LocalStorageQueue";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";

const LAST_RECEIVED_DATE_KEY = "sync.lastReceivedDate";

export class SocketReplicationAdapter implements IReplicationAdapter {
  private socket?: SocketIOClient.Socket;
  private parameters: SocketConnectionParameters;

  constructor(private backendUrl: string, private token: string, private clientId: string, private storage: ILocalStorage = localStorage) {
    this.parameters = {
      token: token,
      clientId: clientId,
      lastReceivedDateMs: this.getLastReceivedDate()
    }
  }

  async connectAsync(): Promise<void> {
    this.socket = io(this.backendUrl, {
      query: this.parameters
    });
    this.socket.on(MessageTypes.EVENT,
      (message: Message<IEvent>) => {
        message = JsonSerializer.clean(message);
        console.log(message);
        this.onEventReceivedAsync(message.payload)
          .then(() => {
            this.setLastReceivedDate(message.payload.info.date.getTime());
          })
      });
  }

  private getLastReceivedDate = (): number => {
    const lrd = this.storage.getItem(LAST_RECEIVED_DATE_KEY);
    if (lrd === null) {
      return 0;
    } else {
      return parseInt(lrd);
    }
  }
  private setLastReceivedDate = (lastReceivedDateMs: number): void =>
    this.storage.setItem(LAST_RECEIVED_DATE_KEY, lastReceivedDateMs.toString());

  sendEventAsync = (event: IEvent): Promise<void> => new Promise((resolve, reject) => {
    const message = new Message(this.clientId, event);
    console.log(`Sending to socket: ${JSON.stringify(message)}`);
    const timeout = setTimeout(() => reject(Error("Timeout forwarding event")), 15000);
    if (this.socket === undefined) {
      reject(Error("Socket is not connected"))
    } else {
      this.socket.emit(MessageTypes.EVENT, message, (response: EventReceivedAck) => {
        console.log(`Received ACK for event: ${response.dateMs}`)
        clearTimeout(timeout);
        this.setLastReceivedDate(response.dateMs)
        resolve();
      });
    }
  });

  onEventReceivedAsync = async (event: IEvent): Promise<void> => {
    console.error("Received an event on the fake receiver")
  }
}