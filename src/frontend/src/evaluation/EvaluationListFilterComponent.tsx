import { Component } from "../html";
import { Evaluation } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select } from "../baseComponents";

export type EvaluationToggleFilterValues = "All" | "Less than a week old";

export interface EvaluationListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Evaluation>) => void;
  initialToggle: EvaluationToggleFilterValues
}

export class EvaluationListFilterComponent extends Component {
  constructor(private props: EvaluationListFilterComponentProps) { super() }

  async render() {
    const filter = {
      toggle: this.props.initialToggle,
    };
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const calculateFilter = () =>
      (evaluation: Evaluation) => (filter.toggle === "All" || evaluation.date.getTime() > aWeekAgo.getTime());

    const onFilterChanged = () => {
      const filter = calculateFilter();
      this.props.onFilterChanged(filter);
    }
    setTimeout(() => onFilterChanged(), 100); // Dirty hack
    return <div class="row">
      <div class="col">
        <Select values={["All", "Less than a week old"]} object={filter} field="toggle" onchange={onFilterChanged} />
      </div>
    </div>
  }
}

export const EvaluationListFilter = (props: EvaluationListFilterComponentProps) => new EvaluationListFilterComponent(props);