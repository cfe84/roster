import { UIContainer, UIElement, Component } from "../html";
import { DashboardComponent, Dashboard } from "./DashboardComponent";
import { PersonController, PersonCreatedEvent, PersonUpdatedEvent } from "../persons";
import { DeadlineController } from "../deadlines";
import { EventBus, IEvent } from "../../lib/common/events";
import { IFakeGenerator } from "../storage/IFakeGenerator";
import { DeadlineCreatedEvent, DeadlineUpdatedEvent } from "../deadlines/DeadlineEvents";
import { NoteCreatedEvent, NoteUpdatedEvent } from "../notes/NoteEvents";
import { DiscussionUpdatedEvent, DiscussionCreatedEvent } from "../discussions/DiscussionEvents";

export interface DashboardControllerDependencies {
  container: UIContainer;
  personController: PersonController;
  deadlineController: DeadlineController;
  fakeGenerator: IFakeGenerator;
  eventBus: EventBus;
  debug: boolean;
}

export class DashboardController {

  constructor(private deps: DashboardControllerDependencies) { }

  public displayDashboard() {
    const component: DashboardComponent = <Dashboard
      personController={this.deps.personController}
      deadlineController={this.deps.deadlineController}
      debug={this.deps.debug}
      onGenerateFakeData={this.generateFakeData}
    ></Dashboard>
    this.deps.container.mount(component);

    const reload = () => this.deps.container.rerenderIfCurrent(component);

    // const subscription1 = this.deps.eventBus.subscribe(PersonCreatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription2 = this.deps.eventBus.subscribe(PersonUpdatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription3 = this.deps.eventBus.subscribe(DeadlineCreatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription4 = this.deps.eventBus.subscribe(DeadlineUpdatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription5 = this.deps.eventBus.subscribe(NoteCreatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription6 = this.deps.eventBus.subscribe(NoteUpdatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription7 = this.deps.eventBus.subscribe(DiscussionUpdatedEvent.type, async (evt: IEvent) => { await reload(); });
    // const subscription8 = this.deps.eventBus.subscribe(DiscussionCreatedEvent.type, async (evt: IEvent) => { await reload(); });
  }

  private generateFakeData = () => {
    this.deps.fakeGenerator.generateAsync(this.deps.eventBus).then(() => { });
  }
}