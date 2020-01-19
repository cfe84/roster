import { Component } from "../html";
import { Evaluation } from ".";
import { CheckboxDisplay, Button } from "../baseComponents";
import { EvaluationCriteria } from "../evaluationCriteria";

export interface EvaluationListItemComponentProps {
  evaluation?: Evaluation,
  evaluationCriteria: EvaluationCriteria,
  onedit: () => void,
  oncreate: () => void,
  onclick: () => void,
  evaluationCriteriaComponent: Component
}

export class EvaluationListItemComponent extends Component {
  constructor(private props: EvaluationListItemComponentProps) {
    super();
  }

  render() {
    let evaluation: Component;
    if (this.props.evaluation) {
      evaluation = <span>
        Rated: <b>{this.props.evaluation.rateName}</b>
        <Button class="ml-3" text="Edit" onclick={this.props.onedit}></Button>
      </span>
    } else {
      evaluation = <Button text="Add evaluation" onclick={this.props.oncreate}></Button>;
    }
    return <span class="w-100 d-flex" onclick={this.props.onclick}>
      <span>{this.props.evaluationCriteriaComponent}</span>
      <span class="ml-auto">{evaluation}</span>
    </span>;
  }
}

export const EvaluationListItem = (props: EvaluationListItemComponentProps) => new EvaluationListItemComponent(props);