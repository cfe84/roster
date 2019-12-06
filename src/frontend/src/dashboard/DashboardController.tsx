import { UIContainer, UIElement, Component } from "../html";
import { DashboardComponent, Dashboard } from "./DashboardComponent";
import { PersonController } from "../persons";

export interface DashboardControllerDependencies {
  container: UIContainer;
  personController: PersonController;
}

export class DashboardController {

  constructor(private deps: DashboardControllerDependencies) { }

  public displayDashboard() {
    const component: DashboardComponent = <Dashboard
      personController={this.deps.personController}
    ></Dashboard>
    this.deps.container.mount(component);
  }
}