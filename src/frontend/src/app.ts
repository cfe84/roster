import { CreatePersonComponent } from "./persons/CreatePersonComponent";
import { UI } from "./html/UI";

class App {
  load() {
    const component = new CreatePersonComponent();
    const container = document.getElementById("container-main");
    if (container === null) {
      alert("Container not found!");
    } else {
      UI.render(component.renderElement(), container);
    }
  }
}


window.onload = () => {
  const app = new App();
  app.load();
}