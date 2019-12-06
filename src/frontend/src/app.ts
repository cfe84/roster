import { PersonController, PersonCreatedEvent, PersonUpdatedEvent, StorePeopleChangesReactor } from "./persons";
import { EventBus, IEvent } from "./events";
import { InMemoryPersonStore } from "./infrastructure/InMemoryPersonStore";
import { IndexedDBStore } from "./infrastructure/IndexedDBStore";
import { NotesController } from "./notes";
import { UIContainer } from "./html/UIContainer";

class App {
  private eventBus: EventBus = new EventBus(true);
  // private peopleStore = new InMemoryPersonStore();

  constructor() {

  }

  async loadAsync(): Promise<void> {
    try {
      const uiContainer = new UIContainer();
      const dbStore = await IndexedDBStore.OpenDbAsync();
      const peopleReactor = new StorePeopleChangesReactor(dbStore);
      peopleReactor.registerReactors(this.eventBus);
      const notesController = new NotesController(uiContainer, dbStore);
      const controller = new PersonController(this.eventBus, uiContainer, dbStore, notesController);
      await controller.loadPeopleListAsync();
    }
    catch (error) {
      console.error(error);
    }
  }
}

window.onload = () => {
  const app = new App();
  app.loadAsync().then(() => { });
}