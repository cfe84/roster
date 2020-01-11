import { Component, UIElement } from "../html";
import { Caption, Button } from ".";

export interface PageTitleProps {
  title: string,
  icon?: string,
  iconRegular?: boolean,
  onBack?: () => void
}

export class PageTitleComponent extends Component {
  constructor(private props: PageTitleProps) {
    super();
  }

  render = (): UIElement => {
    const iconClass = `fa${this.props.iconRegular ? "r" : ""} fa-${this.props.icon}`
    const iconComponent = this.props.icon ? <i class={iconClass}></i> : "";
    const backButton = this.props.onBack ? <Button type="secondary" onclick={this.props.onBack} icon="arrow-left" text="Back" /> : ""
    const component = <div>
      {backButton}
      <h3 class="text-center mb-4 pb-4 border-bottom border-primary">{iconComponent} {this.props.title}</h3>
    </div>
    return component;
  }
}

export const PageTitle = (props: PageTitleProps) => new PageTitleComponent(props);