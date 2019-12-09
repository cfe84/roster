import { Component, UIElement } from "../html";
import { TextInput } from ".";
import { dateUtils } from "../utils/dateUtils";
import { GUID } from "../utils/guid";

export interface DateInputProps {
  caption?: string,
  id?: string,
  onchange?: ((newValue: Date | null) => void),
  placeholder?: string,
  name?: string,
  class?: string,
  value: Date
}

export class DateInputComponent extends Component {
  constructor(private props: DateInputProps) {
    super();
  }

  render = (): UIElement => {
    const onchange = this.props.onchange ? ((evt: any) => { (this.props.onchange as any)(dateUtils.parseDate(evt.target.value)) }) : (undefined);
    const componentId = this.props.id || `input-${this.props.name || GUID.newGuid()}`;
    const component = <div class={this.props.class || ""} >
      <p class="mb-1">{this.props.caption || this.props.name}</p>
      <input class="form-control mb-3" id={componentId} onkeyup={onchange} placeholder={this.props.placeholder || this.props.name || ""} type="text" value={dateUtils.format(this.props.value) || ""}></input>
    </div >;
    return component;
  }
}

export const DateInput = (props: DateInputProps) => new DateInputComponent(props);