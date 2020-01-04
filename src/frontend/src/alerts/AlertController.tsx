import { UIContainer, Component } from "../html";
import { Alert } from "./AlertComponent";

export interface AlertControllerDependencies {
  container: UIContainer;
  debug: boolean;
}

export class AlertController {
  constructor(private deps: AlertControllerDependencies) {
  }

  showAlert(alert: string) {
    const component = <Alert
      message={alert}
    />
    this.deps.container.mount(component)
  }
}