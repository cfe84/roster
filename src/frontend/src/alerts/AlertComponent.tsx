import { Component } from "../html";

export interface AlertComponentProps {
  message: string;
}

export class AlertComponent extends Component {
  constructor(private props: AlertComponentProps) {
    super();
  }

  render = () => {
    return <div class="alert alert-danger" role="alert">
      {this.props.message}
    </div>
  }
}

export const Alert = (props: AlertComponentProps): AlertComponent => new AlertComponent(props);