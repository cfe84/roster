import { Component, UIElement } from "../html";
import { Caption, Button } from ".";

export interface ConfirmationDialogProps {
  title?: string,
  text: string,
  onyes: () => void,
  oncancel: () => void
}

export class ConfirmationDialogComponent extends Component {
  constructor(private props: ConfirmationDialogProps) {
    super();
  }

  render = (): UIElement => {
    const titleComponent = this.props.title ? <h1>{this.props.title}</h1> : "";
    const component = <div class="d-flex">
      <div class="m-auto">
        {titleComponent}
        <div class="text-center mb-5">{this.props.text}</div>
        <div class="d-flex mt-5">
          <Button onclick={this.props.onyes} icon="check" text="Yes" type="delete" />
          <Button class="ml-auto" type="secondary" onclick={this.props.oncancel} icon="times" text="Cancel" />
        </div>
      </div>
    </div>
    return component;
  }
}

export const ConfirmationDialog = (props: ConfirmationDialogProps) => new ConfirmationDialogComponent(props);