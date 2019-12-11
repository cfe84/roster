import { Component, UIElement } from "../html"

export type ButtonType = "primary" | "secondary" | "delete";

export interface ButtonProps {
  icon?: string,
  type?: ButtonType,
  class?: string,
  text: string,
  onclick: () => void
}

const getClass = (type?: string) => {
  switch (type) {
    case "secondary":
      return "btn-secondary";
    case "delete":
      return "btn-danger";
    case "primary":
    default:
      return "btn-primary";
  }
}

export class ButtonComponent extends Component {
  constructor(public props: ButtonProps) { super(); }
  render = (): UIElement => {
    const onclick = (event: MouseEvent) => {
      if (this.props.onclick) {
        this.props.onclick();
      }
      event.stopPropagation();
    }
    const clss = `btn ${this.props.class || ""} ${getClass(this.props.type)}`;
    const iconClass = `fa fa-${this.props.icon}`;
    const icon = this.props.icon ? <i class={iconClass}></i> : "";
    const component = <button class={clss} onclick={onclick}>{icon} {this.props.text}</button>
    return component;
  }
}

export const Button = (props: ButtonProps) => new ButtonComponent(props);  