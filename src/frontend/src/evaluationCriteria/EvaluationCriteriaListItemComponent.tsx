import { Component, UIElement } from "../html";
import { EvaluationCriteria } from ".";
import { CheckboxDisplay } from "../baseComponents";
import { TEXT_NODE_TYPE } from "../html/UIElement";

export interface EvaluationCriteriaListItemComponentProps {
  evaluationCriteria: EvaluationCriteria
}

export class EvaluationCriteriaListItemComponent extends Component {
  constructor(private props: EvaluationCriteriaListItemComponentProps) {
    super();
  }

  render() {
    let content = new UIElement(TEXT_NODE_TYPE, {
      text: this.props.evaluationCriteria.title
    });
    if (!this.props.evaluationCriteria.active) {
      content = <s>{content}</s>
    }
    return content;
  }
}

export const EvaluationCriteriaListItem = (props: EvaluationCriteriaListItemComponentProps) => new EvaluationCriteriaListItemComponent(props);