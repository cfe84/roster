import { Component } from "../html";
import { EvaluationCriteria } from ".";
import { CheckboxDisplay } from "../baseComponents";

export interface EvaluationCriteriaListItemComponentProps {
  evaluationCriteria: EvaluationCriteria
}

export class EvaluationCriteriaListItemComponent extends Component {
  constructor(private props: EvaluationCriteriaListItemComponentProps) {
    super();
  }

  render() {
    let content = this.props.evaluationCriteria.title;
    if (!this.props.evaluationCriteria.active) {
      content = <s>{content}</s>
    }
    return <span>
      {content}
    </span>;
  }
}

export const EvaluationCriteriaListItem = (props: EvaluationCriteriaListItemComponentProps) => new EvaluationCriteriaListItemComponent(props);