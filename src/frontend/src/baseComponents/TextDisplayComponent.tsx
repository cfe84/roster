import { Component, UIElement } from "../html";
import { Caption } from ".";

export interface TextDisplayProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: string
}

export class TextDisplayComponent extends Component {
  constructor(private props: TextDisplayProps) {
    super();
  }

  render = (): UIElement => {
    const value = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    const caption = <Caption caption={this.props.caption} />;
    const component = <div class={this.props.class || ""}>
      {caption.render()}
      <p class="mb-3">{value}</p>
    </div>
    return component;
  }
}

export const TextDisplay = (props: TextDisplayProps) => new TextDisplayComponent(props);