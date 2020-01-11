import { Component } from "../html";
import { Action } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select, Checkbox } from "../baseComponents";

export type ActionResponsibilityFilter = "mine" | "theirs" | "all";

export interface ActionListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Action>) => void;
  initialResponsibility: ActionResponsibilityFilter,
  initialShowCompleted: boolean
}

export class ActionListFilterComponent extends Component {
  constructor(private props: ActionListFilterComponentProps) { super() }

  render() {
    const filter = {
      responsibility: this.props.initialResponsibility,
      showCompleted: this.props.initialShowCompleted ? "Show" : "Hide"
    };
    const calculateFilter = () =>
      (action: Action) => (filter.showCompleted === "Show" || !action.completed) && (filter.responsibility === "all" || action.responsibility === filter.responsibility);

    const onFilterChanged = () => {
      const filter = calculateFilter();
      this.props.onFilterChanged(filter);
    }
    return <div class="row">
      <div class="col">
        <Select caption="Responsibility" values={["mine", "theirs", "all"]} object={filter} field="responsibility" onchange={onFilterChanged} />
      </div>
      <div class="col">
        <Select caption="Completed tasks" values={["Show", "Hide"]} object={filter} field="showCompleted" onchange={onFilterChanged} />
      </div>
    </div>
  }
}

export const ActionListFilter = (props: ActionListFilterComponentProps) => new ActionListFilterComponent(props);