import { Component } from "../html";
import { Action } from ".";

export interface ActionListItemComponentProps {
  action: Action
}

export class ActionListItemComponent extends Component {
  constructor(private props: ActionListItemComponentProps) {
    super();
  }

  render() {
    return <span>{this.props.action.summary}</span>;
  }
}

export const ActionListItem = (props: ActionListItemComponentProps) => new ActionListItemComponent(props);