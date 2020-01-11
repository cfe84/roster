import { Component } from "../html";
import { Template } from ".";
import { CheckboxDisplay } from "../baseComponents";

export interface TemplateListItemComponentProps {
  template: Template
}

export class TemplateListItemComponent extends Component {
  constructor(private props: TemplateListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.template.title;
    return <span>
      {content}
    </span>;
  }
}

export const TemplateListItem = (props: TemplateListItemComponentProps) => new TemplateListItemComponent(props);