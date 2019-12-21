import { app, BrowserWindow, Menu, dialog } from "electron";
import { existsSync } from "fs";

class Main {
  window?: BrowserWindow;
  openFileDialog = () => {
    const file = dialog.showOpenDialogSync({ title: "Open roster", properties: ['openFile'], filters: [{ name: "Json file", extensions: ["json"] }] });
    if (file && file.length > 0) {
      this.loadFile(file[0]);
    }
  }

  createFileDialog = () => {
    const file = dialog.showSaveDialogSync({ title: "Create roster", filters: [{ name: "Json file", extensions: ["json"] }] });
    if (file) {
      console.log(file);
      this.loadFile(file);
    }
  }

  loadFile = (file?: string) => {
    const oldWindow = this.window;
    this.window = new BrowserWindow({
      width: 1200,
      height: 1000,
      webPreferences: {
        nodeIntegration: true
      },
      title: "Roster",
      icon: __dirname + "/frontend/icon.png"
    });
    this.window.loadFile(__dirname + "/frontend/index.html", {
      query: {
        sync: "false",
        store: "fs",
        file: file || "",
        showNavbar: "false"
      }
    });
    if (oldWindow) {
      oldWindow.close()
    }
  }

  load = () => {
    const isMac = process.platform === 'darwin';
    let menu = Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "Open",
            accelerator: "ctrl+O",
            click: () => { this.openFileDialog() }
          },
          {
            label: "Create",
            accelerator: "ctrl+N",
            click: () => { this.createFileDialog() }
          },
          isMac ? { role: 'close' } : { role: 'quit' }
        ]
      },
      { role: "editMenu" },
      { role: "viewMenu" }
    ])
    Menu.setApplicationMenu(menu);
    this.loadFile();
  }
}
const main = new Main();
app.on("ready", main.load);