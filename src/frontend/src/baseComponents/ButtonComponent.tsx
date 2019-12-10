import { Component, UIElement } from "../html"

export type ButtonType = "primary" | "secondary";

export interface ButtonProps {
  icon?: string,
  type?: ButtonType,
  class?: string,
  text: string,
  onclick: () => void
}

export class ButtonComponent extends Component {
  constructor(private props: ButtonProps) { super(); }
  render = (): UIElement => {
    const onclick = (event: MouseEvent) => {
      if (this.props.onclick) {
        this.props.onclick();
      }
      event.stopPropagation();
    }
    const clss = `btn ${this.props.class || ""} ${(this.props.type && this.props.type === "secondary") ? "btn-secondary" : "btn-primary"}`;
    const iconClass = `fa fa-${this.props.icon}`;
    const icon = this.props.icon ? <i class={iconClass}></i> : "";
    const component = <button class={clss} onclick={onclick}>{icon} {this.props.text}</button>
    return component;
  }
}

export const Button = (props: ButtonProps) => new ButtonComponent(props);  