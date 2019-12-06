import { StorePeopleChangesReactor, PersonController } from "./persons";
import { EventBus } from "./events";
import { IndexedDBStore } from "./infrastructure/IndexedDBStore";
import { NotesController } from "./notes";
import { UIContainer } from "./html/UIContainer";
import { BrowserDisplayAdapter } from "./html/BrowserDisplayAdapter";
import { DashboardController } from "./dashboard/DashboardController";
import { FontAwesomeLoader } from "./utils/FontAwesomeLoader";

class App {
  private eventBus: EventBus = new EventBus(true);

  constructor() {

  }

  async loadAsync(): Promise<void> {
    try {
      const displayAdapter = new BrowserDisplayAdapter();
      const mainContainer = displayAdapter.getElementFromDom("container-main");
      const uiContainer = new UIContainer({
        displayAdapter,
        container: mainContainer
      });
      const dbStore = await IndexedDBStore.OpenDbAsync();
      const peopleReactor = new StorePeopleChangesReactor(dbStore);
      peopleReactor.registerReactors(this.eventBus);
      const notesController = new NotesController({ uiContainer, db: dbStore, eventBus: this.eventBus });
      const peopleController = new PersonController(this.eventBus, uiContainer, dbStore, notesController);
      const dashboardController = new DashboardController({
        container: uiContainer,
        personController: peopleController
      })
      dashboardController.displayDashboard();
    }
    catch (error) {
      console.error(error);
    }
  }
}

window.onload = () => {
  const app = new App();
  FontAwesomeLoader.loadFontAwesome();
  app.loadAsync().then(() => { });
}