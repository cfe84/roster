import { Component } from "../html";
import { Observation } from ".";
import { CheckboxDisplay } from "../baseComponents";

export interface ObservationListItemComponentProps {
  observation: Observation
}

export class ObservationListItemComponent extends Component {
  constructor(private props: ObservationListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.observation.title;
    return <span>
      {content}
    </span>;
  }
}

export const ObservationListItem = (props: ObservationListItemComponentProps) => new ObservationListItemComponent(props);