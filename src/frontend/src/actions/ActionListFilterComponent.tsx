import { Component } from "../html";
import { Action } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select, Checkbox } from "../baseComponents";
import { AsyncTimeout } from "../../lib/common/utils/AsyncTimeout";

export type ActionResponsibilityFilter = "mine" | "theirs" | "all";

export interface ActionListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Action>) => void;
  initialResponsibility: ActionResponsibilityFilter,
  initialShowCompleted: boolean
}

export class ActionListFilterComponent extends Component {
  constructor(private props: ActionListFilterComponentProps) { super() }

  async render() {
    const filter = {
      responsibility: this.props.initialResponsibility,
      showCompleted: this.props.initialShowCompleted ? "All" : "Hide completed"
    };
    const calculateFilter = () =>
      (action: Action) => (filter.showCompleted === "All" || !action.completed) && (filter.responsibility === "all" || action.responsibility === filter.responsibility);

    const onFilterChanged = () => {
      const filter = calculateFilter();
      this.props.onFilterChanged(filter);
    }
    setTimeout(() => onFilterChanged(), 100); // Dirty hack
    return <div class="row">
      <div class="col">
        <Select values={["mine", "theirs", "all"]} object={filter} field="responsibility" onchange={onFilterChanged} />
      </div>
      <div class="col">
        <Select values={["All", "Hide completed"]} object={filter} field="showCompleted" onchange={onFilterChanged} />
      </div>
    </div>
  }
}

export const ActionListFilter = (props: ActionListFilterComponentProps) => new ActionListFilterComponent(props);