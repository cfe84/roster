import http from "http";
import io from "socket.io";
import fs from "fs";

class App {
  constructor(private port = 3501) { }

  listener = (req: any, res: http.ServerResponse) => {
    const index = fs.readFileSync("./index.html");
    res.statusCode = 200;
    res.write(index);
    res.end();
  }

  loadSocket = (app: http.Server) => {
    const IO = io(app);
    IO.on('connection', function (socket: SocketIO.Socket) {
      socket.on("handshake", (data) => {
        console.log(data);

        setInterval(() => {
          socket.emit("evt", { message: "You are " + data.id });
          console.log("sending");
        }, 2000);
      })
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