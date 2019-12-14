import http from "http";
import io from "socket.io";
import fs from "fs";
import { ConnectionManager } from "./ConnectionManager/ConnectionManager";
import { SocketIoSocket } from "./infrastructure/SocketIoSocket";
import { EventBus } from "../lib/common/events";
import { IEventStore } from "./Storage/IEventStore";
import { MemoryEventStore } from "./infrastructure/InMemoryEventStore";

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
      new ConnectionManager({ eventBus: this.eventBus, eventStore: this.eventStore }, new SocketIoSocket(socket));
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