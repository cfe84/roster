import { Component, UIElement } from "../html";
import { TextInput } from ".";
import { dateUtils } from "../utils/dateUtils";
import { TextInputProps } from "./TextInputComponent";

type onChangeDelegate = (val: Date | null) => void;
type onTxtChangeDelegate = (val: string) => void;

export interface DateInputProps {
  caption?: string,
  id?: string,
  includetime?: boolean,
  onchange?: onChangeDelegate,
  placeholder?: string,
  class?: string,
  object?: any,
  field?: string,
  value?: Date,
}

const getOnChange = (onchange?: onChangeDelegate, object?: object, field?: string): onTxtChangeDelegate => {
  if (onchange && object && field) {
    return (strVal: string) => {
      const val = dateUtils.parseDate(strVal);
      (object as any)[field] = val;
      onchange(val);
    }
  } else if (onchange) {
    return (strVal: string) => onchange(dateUtils.parseDate(strVal));
  } else if (object && field) {
    return (strVal: string) => (object as any)[field] = dateUtils.parseDate(strVal);
  } else {
    return (strVal: string) => { }
  }
}

export class DateInputComponent extends Component {
  constructor(private props: DateInputProps) {
    super();
  }

  render = (): UIElement => {
    const onchange = getOnChange(this.props.onchange, this.props.object, this.props.field);
    const value = this.props.value || ((this.props.object && this.props.field) ? this.props.object[this.props.field] : null);

    const textInputProps: TextInputProps = {
      caption: this.props.caption,
      class: this.props.class,
      id: this.props.id,
      onchange: onchange,
      placeholder: this.props.placeholder,
      value: (!this.props.includetime) ? dateUtils.format(value) : dateUtils.formatWithTime(value)
    }
    const textInput = TextInput(textInputProps);
    return textInput.render();
  }
}

export const DateInput = (props: DateInputProps) => new DateInputComponent(props);