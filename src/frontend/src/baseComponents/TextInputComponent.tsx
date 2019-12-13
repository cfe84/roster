import { Component, UIElement } from "../html";
import { GUID } from "../../lib/common/utils/guid";
import { Caption } from ".";

export interface TextInputProps {
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

export class TextInputComponent extends Component {
  constructor(private props: TextInputProps) {
    super();
  }

  render = (): UIElement => {
    const value = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    const componentId = this.props.id || `input-${GUID.newGuid()}`;
    const onchange = getOnChange(this.props.onchange, this.props.object, this.props.field);
    const caption = this.props.caption ? <Caption caption={this.props.caption} /> : "";
    const component = <div class={this.props.class || ""}>
      {caption.render()}
      <input class="form-control mb-3"
        id={componentId}
        onkeyup={onchange}
        placeholder={this.props.placeholder || this.props.caption || ""}
        type="text"
        value={value || ""}></input>
    </div>
    return component;
  }
}

export const TextInput = (props: TextInputProps) => new TextInputComponent(props);