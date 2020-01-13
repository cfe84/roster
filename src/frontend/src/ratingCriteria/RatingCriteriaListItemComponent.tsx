import { Component } from "../html";
import { RatingCriteria } from ".";
import { CheckboxDisplay } from "../baseComponents";

export interface RatingCriteriaListItemComponentProps {
  ratingCriteria: RatingCriteria
}

export class RatingCriteriaListItemComponent extends Component {
  constructor(private props: RatingCriteriaListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.ratingCriteria.title;
    return <span>
      {content}
    </span>;
  }
}

export const RatingCriteriaListItem = (props: RatingCriteriaListItemComponentProps) => new RatingCriteriaListItemComponent(props);