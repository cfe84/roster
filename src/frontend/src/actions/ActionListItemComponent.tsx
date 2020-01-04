import { Component } from "../html";
import { Action } from ".";
import { CheckboxDisplay } from "../baseComponents";

export interface ActionListItemComponentProps {
  action: Action
}

export class ActionListItemComponent extends Component {
  constructor(private props: ActionListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.action.summary;
    if (this.props.action.completed) {
      content = <s>{content}</s>
    }
    // const checkbox = <CheckboxDisplay value={this.props.action.done} />;
    return <span>

      {content}
    </span>;
  }
}

export const ActionListItem = (props: ActionListItemComponentProps) => new ActionListItemComponent(props);