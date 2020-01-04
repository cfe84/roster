import { Component, UIElement } from "../html";
import { Caption } from ".";

export interface CheckboxDisplayComponentProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: boolean,
}

export class CheckboxDisplayComponent extends Component {
  constructor(private props: CheckboxDisplayComponentProps) {
    super();
  }
  private getValue = () =>
    this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");

  render = (): UIElement => {
    const caption = <Caption caption={this.props.caption} />;
    let clss = "far ";
    if (this.getValue()) {
      clss += "fa-check-square";
    } else {
      clss += "fa-square";
    }
    return <div class={this.props.class || ""}>
      {caption}
      <p class="mb-3"><i class={clss}></i> {this.props.caption}</p>
    </div>;
  }
}

export const CheckboxDisplay = (props: CheckboxDisplayComponentProps) => new CheckboxDisplayComponent(props);