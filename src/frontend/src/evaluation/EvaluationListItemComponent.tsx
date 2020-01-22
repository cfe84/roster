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
        <Button class="ml-3" type="secondary" icon="pen" outline={true} text="" onclick={this.props.onedit}></Button>
      </span>
    } else {
      evaluation = <Button text="Add evaluation" outline={true} onclick={this.props.oncreate}></Button>;
    }
    const clss = `p-0 w-100 d-flex align-items-center ${this.props.onclick ? "btn" : ""}`
    return <span class={clss} onclick={this.props.onclick}>
      {this.props.evaluationCriteriaComponent}
      <span class="ml-auto">{evaluation}</span>
    </span>;
  }
}

export const EvaluationListItem = (props: EvaluationListItemComponentProps) => new EvaluationListItemComponent(props);