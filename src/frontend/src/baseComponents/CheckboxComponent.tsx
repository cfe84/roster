import { Component, UIElement } from "../html";
import { Caption } from ".";

export interface CheckboxComponentProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: boolean,
}

export class CheckboxComponent extends Component {
  constructor(private props: CheckboxComponentProps) {
    super();
  }
  private getValue = () =>
    this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");

  render = (): UIElement => {
    const caption = <Caption caption={this.props.caption} />;
    let component: UIElement;
    const onclick = () => {
      this.props.value = !this.getValue();
      if (this.props.object && this.props.field) {
        (this.props.object as any)[this.props.field] = this.props.value;
      }
    }
    if (this.getValue()) {
      component = <input type="checkbox" onclick={onclick} checked="true">{this.props.caption}</input>;
    } else {
      component = <input type="checkbox" onclick={onclick}>{this.props.caption}</input>;
    }
    return <div class={this.props.class || ""}>
      {caption}
      <p class="mb-3">{component}</p>
    </div>;
  }
}

export const Checkbox = (props: CheckboxComponentProps) => new CheckboxComponent(props);