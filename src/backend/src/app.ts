import http from "http";
import io from "socket.io";
import fs from "fs";
import { ConnectionManager, ConnectionInformation } from "./ConnectionManager/ConnectionManager";
import { SocketIoSocket } from "./infrastructure/SocketIoSocket";
import { EventBus } from "../lib/common/events";
import { IAccountEventStore } from "./Storage/IAccountEventStore";
import { MemoryEventStore } from "./infrastructure/InMemoryEventStore";
import { SocketConnectionParameters } from "../lib/common/message";
import { Token } from "./authorization/Token";
import { IStorageProvider } from "./Storage/IStorageProvider";
import { StorageFactory } from "./infrastructure/StorageFactory";
import { TokenGenerator } from "./authorization/TokenGenerator";
import { IConfigurationProvider } from "./IConfigurationProvider";
import { EnvironmentConfigurationProvider } from "./infrastructure/EnvironmentConfigurationProvider";

class App {
  private eventBus: EventBus = new EventBus("server");
  private storageProvider: IStorageProvider = StorageFactory.getStorageProvider();
  private configurationProvider: IConfigurationProvider = new EnvironmentConfigurationProvider();
  private tokenGenerator: TokenGenerator;
  constructor(private port = 3501) {
    // Todo: change validity when login is there.
    this.tokenGenerator = new TokenGenerator(this.configurationProvider.getTokenSecret(), 864000);
  }

  listener = (req: any, res: http.ServerResponse) => {
    const index = fs.readFileSync("./index.html");
    res.statusCode = 200;
    res.write(index);
    res.end();
  }

  loadSocket = (app: http.Server) => {
    const IO = io(app);
    IO.use((socket: io.Socket, next) => {
      const query = (socket.handshake.query as SocketConnectionParameters)
      if (!query || !query.token) {
        console.error(`Connection rejected: unauthorized.`)
        return next(Error(`Unauthorized`));
      }
      try {
        const token = this.tokenGenerator.validateToken(query.token);
        socket.handshake.query.token = token;
      } catch (error) {
        console.error(`Connection rejected: ${error}`)
        next(error);
      }
    })
    IO.on('connection', (socket: SocketIO.Socket) => {
      console.log("New connection");
      const parameters = socket.handshake.query as SocketConnectionParameters;
      const token = Token.deserialize(parameters.token);
      const info: ConnectionInformation = {
        accountId: token.accountId,
        clientId: parameters.clientId,
        lastReceivedDateMs: parameters.lastReceivedDateMs
      };
      this.storageProvider
        .getAccountEventStoreAsync(token.accountId)
        .then(storageProvider => new ConnectionManager({
          eventBus: this.eventBus,
          eventStore: storageProvider
        }, new SocketIoSocket(socket), info, true))
        .then((manager) => manager.startAsync())
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