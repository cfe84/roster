import { PeopleController } from "./persons/PeopleController";
import { EventBus, IEvent } from "./events";
import { PersonCreatedEvent } from "./persons/PersonCreatedEvent";

class App {
  private eventBus: EventBus = new EventBus();

  constructor() {
    this.eventBus.subscribe(PersonCreatedEvent.type,
      async (evt: IEvent) => console.log(`Person created: ${JSON.stringify(evt)}`));
  }

  async loadAsync(): Promise<void> {
    const controller = new PeopleController(this.eventBus);
    await controller.loadPeopleListAsync();
  }
}

window.onload = () => {
  const app = new App();
  app.loadAsync().then(() => { });
}