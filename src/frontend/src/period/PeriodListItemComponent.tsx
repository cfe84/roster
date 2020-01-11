import { Component } from "../html";
import { Period } from ".";

export interface PeriodListItemComponentProps {
  period: Period
}

export class PeriodListItemComponent extends Component {
  constructor(private props: PeriodListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.period.name;
    return <span>
      {content}
    </span>;
  }
}

export const PeriodListItem = (props: PeriodListItemComponentProps) => new PeriodListItemComponent(props);