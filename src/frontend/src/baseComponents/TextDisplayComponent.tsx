import { Component, UIElement } from "../html";

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
    const component = <div class={this.props.class || ""}>
      <em class="mb-1">{this.props.caption}</em>
      <p class="mb-3">{value}</p>
    </div>
    return component;
  }
}

export const TextDisplay = (props: TextDisplayProps) => new TextDisplayComponent(props);