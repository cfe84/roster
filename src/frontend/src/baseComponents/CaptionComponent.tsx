import { Component, UIElement } from "../html";

export interface CaptionProps {
  caption?: string,
}

export class CaptionComponent extends Component {
  constructor(private props: CaptionProps) {
    super();
  }

  render = (): UIElement => {
    const component = this.props.caption ? <p><em class="color-strong mb-1">{this.props.caption}</em></p> : ""
    return component;
  }
}

export const Caption = (props: CaptionProps) => new CaptionComponent(props);