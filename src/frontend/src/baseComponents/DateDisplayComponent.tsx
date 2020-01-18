import { Component, UIElement } from "../html";
import { Caption } from ".";
import { dateUtils } from "../utils/dateUtils";

export interface DateDisplayProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: Date,
  includeTimespan?: boolean,
  includetime?: boolean,
}

export class DateDisplayComponent extends Component {
  constructor(private props: DateDisplayProps) {
    super();
  }

  render = (): UIElement => {
    const value = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    const timespan = value ? dateUtils.timeSpan(value) + " " : "";
    const timespanComponent = (this.props.includeTimespan && timespan) ? timespan : "";
    let formattedDate = this.props.includetime ? dateUtils.formatWithTime(value) : dateUtils.format(value);
    if (timespanComponent !== "") {
      formattedDate = <i>({formattedDate})</i>;
    }
    const caption = <Caption caption={this.props.caption} />;
    const component = <div class={this.props.class || ""}>
      {caption.render()}
      <p class="mb-3">{timespanComponent} {formattedDate}</p>
    </div>
    return component;
  }
}

export const DateDisplay = (props: DateDisplayProps) => new DateDisplayComponent(props);