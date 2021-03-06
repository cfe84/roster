import { Component, UIElement } from "../html";
import { Caption } from ".";

export interface SelectComponentProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: string,
  onchange?: (value: string) => void,
  values: any[]
}

class OptionComponent extends Component {
  constructor(public value: any, public selected: boolean, private onSelectedAsync: (option: OptionComponent) => Promise<void>) {
    super();
  }

  private element?: UIElement;

  private getClass = () => "btn " + (this.selected ? "btn-outline-dark" : "btn-outline-light");

  updateAsync = async (selected: boolean) => {
    this.selected = selected;
    if (this.element) {
      this.element.props["class"] = this.getClass();
      await this.element.updateNodeAsync();
    }
  }

  render() {
    const onclick = () => { this.onSelectedAsync(this).then(() => { }) }
    this.element = <label class={this.getClass()} onclick={onclick} >
      {this.value}
    </label>;
    return this.element as UIElement;
  }
}

export class SelectComponent extends Component {
  constructor(private props: SelectComponentProps) {
    super();
  }


  render = (): UIElement => {
    const currentValue = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    let currentlySelectedValue: OptionComponent;
    const onSelectedAsync = async (newlySelectedValue: OptionComponent) => {
      this.props.value = newlySelectedValue.value;
      if (this.props.object && this.props.field) {
        (this.props.object as any)[this.props.field] = this.props.value;
      }
      await newlySelectedValue.updateAsync(true);
      await currentlySelectedValue.updateAsync(false);
      currentlySelectedValue = newlySelectedValue;
      if (this.props.onchange) {
        this.props.onchange(this.props.value as string);
      }
    }
    const options = this.props.values.map(value => new OptionComponent(value, value === currentValue, onSelectedAsync));
    currentlySelectedValue = options.find((option) => option.value === currentValue) || options[0];

    const caption = <Caption caption={this.props.caption} />;
    const component = <div class={this.props.class || ""}>
      {caption.render()}
      <div class="btn-group-sm">{options}</div>
    </div>
    return component;
  }
}

export const Select = (props: SelectComponentProps) => new SelectComponent(props);