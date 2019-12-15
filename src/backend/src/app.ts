import http from "http";
import io from "socket.io";
import fs from "fs";
import { ConnectionManager, ConnectionInformation } from "./ConnectionManager/ConnectionManager";
import { SocketIoSocket } from "./infrastructure/SocketIoSocket";
import { EventBus } from "../lib/common/events";
import { IEventStore } from "./Storage/IEventStore";
import { MemoryEventStore } from "./infrastructure/InMemoryEventStore";
import { SocketConnectionParameters } from "../lib/common/message";
import { Token } from "../lib/common/authorization";
import { BufferBasedB64 } from "./infrastructure/BufferBasedB64";

class App {
  private eventBus: EventBus = new EventBus("server");
  private eventStore: IEventStore = new MemoryEventStore();
  constructor(private port = 3501) { }

  listener = (req: any, res: http.ServerResponse) => {
    const index = fs.readFileSync("./index.html");
    res.statusCode = 200;
    res.write(index);
    res.end();
  }

  loadSocket = (app: http.Server) => {
    const IO = io(app);
    IO.on('connection', (socket: SocketIO.Socket) => {
      console.log("New connection");
      const parameters = socket.handshake.query as SocketConnectionParameters;
      const token = Token.deserialize(parameters.token);
      const info: ConnectionInformation = {
        accountId: token.accountId,
        clientId: parameters.clientId,
        lastReceivedDateMs: parameters.lastReceivedDateMs
      };
      const manager = new ConnectionManager({ eventBus: this.eventBus, eventStore: this.eventStore }, new SocketIoSocket(socket), info, true);
      manager.startAsync().then();
    });
  }

  loadAsync = async () => {
    const app = http.createServer(this.listener);
    this.loadSocket(app);
    app.listen(this.port, () => {
      console.log(`Listening on port ${this.port}`)
    });
  }
}

const app = new App();
app.loadAsync().then();