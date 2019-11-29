import { EditPersonComponent, ListPersonsComponent } from "./persons/index";
import { SetupPinCodeComponent } from "./authentication/SetupPinCodeComponent";
import { UI } from "./html/UI";
import { ListItemPersonComponent } from "./persons/ListItemPersonComponent";

class App {
  load() {
    const component = ListPersonsComponent();
    const container = document.getElementById("container-main");
    if (container === null) {
      alert("Container not found!");
    } else {
      UI.render(component, container);
    }
  }
}


window.onload = () => {
  const app = new App();
  app.load();
}