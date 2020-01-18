import { Component, UIElement } from "../html";
import { Caption } from ".";

export interface CheckboxComponentProps {
  caption?: string,
  text?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: boolean,
  onchange?: (value: boolean) => void
}

export class CheckboxComponent extends Component {
  constructor(private props: CheckboxComponentProps) {
    super();
  }
  private getValue = () =>
    this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");

  render = (): UIElement => {
    const caption = this.props.caption ? <Caption caption={this.props.caption} /> : "";
    let component: UIElement;
    const onclick = () => {
      this.props.value = !this.getValue();
      if (this.props.object && this.props.field) {
        (this.props.object as any)[this.props.field] = this.props.value;
      }
      if (this.props.onchange) {
        this.props.onchange(this.props.value);
      }
    }
    if (this.getValue()) {
      component = <input type="checkbox" onclick={onclick} checked="true" />;
    } else {
      component = <input type="checkbox" onclick={onclick} />;
    }
    const text = this.props.text || this.props.caption || "";
    return <div class={this.props.class || ""}>
      {caption}
      <span>{component} {text}</span>
    </div>;
  }
}

export const Checkbox = (props: CheckboxComponentProps) => new CheckboxComponent(props);