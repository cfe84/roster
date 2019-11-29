import { EditPersonComponent, ListPeopleComponent } from "./persons/index";
import { SetupPinCodeComponent } from "./authentication/SetupPinCodeComponent";
import { UI } from "./html/UI";
import { ListItemPersonComponent } from "./persons/ListItemPersonComponent";
import { PeopleController } from "./persons/PeopleController";

class App {
  async loadAsync(): Promise<void> {
    const controller = new PeopleController();
    await controller.loadPeopleListAsync();
  }
}

window.onload = () => {
  const app = new App();
  app.loadAsync().then(() => { });
}