import { PeopleController, PersonCreatedEvent, PersonUpdatedEvent, StorePeopleChangesReactor } from "./persons";
import { EventBus, IEvent } from "./events";
import { InMemoryPersonStore } from "./infrastructure/InMemoryPersonStore";
import { IndexedDBStore } from "./infrastructure/IndexedDBStore";

class App {
  private eventBus: EventBus = new EventBus();
  // private peopleStore = new InMemoryPersonStore();

  constructor() {

  }

  async loadAsync(): Promise<void> {
    try {
      const dbStore = await IndexedDBStore.OpenDbAsync();
      const peopleReactor = new StorePeopleChangesReactor(dbStore);
      peopleReactor.registerReactors(this.eventBus);
      const controller = new PeopleController(this.eventBus, dbStore);
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