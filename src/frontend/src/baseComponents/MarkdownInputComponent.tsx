import { Component, UIElement } from "../html";
import { GUID } from "../utils/guid";

export interface MarkdownInputProps {
  caption?: string,
  id?: string,
  onchange?: ((newValue: string) => void),
  placeholder?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: string
}

type onChangeDelegate = (val: string) => void;

const getOnChange = (onchange?: onChangeDelegate, object?: object, field?: string): onChangeDelegate => {
  if (onchange && object && field) {
    return (evt: any) => {
      const val = evt.target.value;
      (object as any)[field] = val;
      onchange(val);
    }
  } else if (onchange) {
    return (evt: any) => onchange(evt.target.value);
  } else if (object && field) {
    return (evt: any) => (object as any)[field] = evt.target.value;
  } else {
    return (evt: any) => { }
  }
}

export class MarkdownInputComponent extends Component {
  constructor(private props: MarkdownInputProps) {
    super();
  }

  render = (): UIElement => {
    const value = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    const componentId = this.props.id || `input-${GUID.newGuid()}`;
    const onchange = getOnChange(this.props.onchange, this.props.object, this.props.field);
    const caption = this.props.caption ? <p class="mb-1">{this.props.caption}</p> : "";
    const component = <div class={this.props.class || ""}>
      {caption}
      <textarea class="form-control mb-3 input-markdown"
        onkeyup={onchange}
        id={componentId}
        placeholder={this.props.placeholder || this.props.caption || ""}
      >{value}</textarea>
    </div>
    return component;
  }
}

export const MarkdownInput = (props: MarkdownInputProps) => new MarkdownInputComponent(props);