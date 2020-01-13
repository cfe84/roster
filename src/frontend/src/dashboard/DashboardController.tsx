import { UIContainer, UIElement, Component } from "../html";
import { DashboardComponent, Dashboard } from "./DashboardComponent";
import { PersonController, PersonCreatedEvent, PersonUpdatedEvent } from "../persons";
import { DeadlineController } from "../deadlines";
import { EventBus, IEvent } from "../../lib/common/events";
import { IFakeGenerator } from "../storage/IFakeGenerator";
import { DeadlineCreatedEvent, DeadlineUpdatedEvent } from "../deadlines/DeadlineEvents";
import { NoteCreatedEvent, NoteUpdatedEvent } from "../notes/NoteEvents";
import { DiscussionUpdatedEvent, DiscussionCreatedEvent } from "../discussions/DiscussionEvents";
import { ActionController } from "../actions";
import { ConfigurationComponent, Configuration } from "./ConfigurationComponent";
import { EvaluationCriteriaController } from "../evaluationCriteria";

export interface DashboardControllerDependencies {
  container: UIContainer;
  personController: PersonController;
  deadlineController: DeadlineController;
  actionController: ActionController;
  evaluationCriteriaController: EvaluationCriteriaController;
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
      actionController={this.deps.actionController}
      debug={this.deps.debug}
      onGenerateFakeData={this.generateFakeData}
      onConfigurationClicked={() => this.displayConfiguration()}
    ></Dashboard>
    this.deps.container.mount(component);
  }

  public displayConfiguration() {
    const component: ConfigurationComponent = <Configuration
      evaluationCriteriaController={this.deps.evaluationCriteriaController}
      onBack={() => this.deps.container.unmountCurrent()}
      debug={this.deps.debug}
    />
    this.deps.container.mount(component);
  }

  private generateFakeData = () => {
    this.deps.fakeGenerator.generateAsync(this.deps.eventBus).then(() => { });
  }
}