import { PeopleController, PersonCreatedEvent, PersonUpdatedEvent, StorePeopleChangesReactor } from "./persons";
import { EventBus, IEvent } from "./events";
import { InMemoryPersonStore } from "./infrastructure/InMemoryPersonStore";

class App {
  private eventBus: EventBus = new EventBus();
  private peopleStore = new InMemoryPersonStore();

  constructor() {
    const peopleReactor = new StorePeopleChangesReactor(this.peopleStore);
    peopleReactor.registerReactors(this.eventBus);
  }

  async loadAsync(): Promise<void> {
    const controller = new PeopleController(this.eventBus, this.peopleStore);
    await controller.loadPeopleListAsync();
  }
}

window.onload = () => {
  const app = new App();
  app.loadAsync().then(() => { });
}