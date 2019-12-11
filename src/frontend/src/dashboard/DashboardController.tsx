import { UIContainer, UIElement, Component } from "../html";
import { DashboardComponent, Dashboard } from "./DashboardComponent";
import { PersonController } from "../persons";
import { DeadlineController } from "../deadlines";

export interface DashboardControllerDependencies {
  container: UIContainer;
  personController: PersonController;
  deadlineController: DeadlineController;
}

export class DashboardController {

  constructor(private deps: DashboardControllerDependencies) { }

  public displayDashboard() {
    const component: DashboardComponent = <Dashboard
      personController={this.deps.personController}
      deadlineController={this.deps.deadlineController}
    ></Dashboard>
    this.deps.container.mount(component);
  }
}