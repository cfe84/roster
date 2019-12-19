import { app, BrowserWindow } from "electron";

class Main {
  load() {
    let window = new BrowserWindow({
      width: 800,
      height: 800,
    });
    window.loadFile("./dist/frontend/index.html", {
      query: {
        electron: "true"
      }
    });
  }
}
const main = new Main();
app.on("ready", main.load);