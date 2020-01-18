import { Component } from "../html";
import { Observation } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select } from "../baseComponents";

export type ObservationToggleFilterValues = "All" | "Unattributed";

export interface ObservationListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Observation>) => void;
  initialToggle: ObservationToggleFilterValues
}

export class ObservationListFilterComponent extends Component {
  constructor(private props: ObservationListFilterComponentProps) { super() }

  async render() {
    const filter = {
      toggle: this.props.initialToggle,
    };
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const calculateFilter = () =>
      (observation: Observation) => (filter.toggle === "All" || observation.observedCriteriaIds.length === 0);

    const onFilterChanged = () => {
      const filter = calculateFilter();
      this.props.onFilterChanged(filter);
    }
    setTimeout(() => onFilterChanged(), 100); // Dirty hack
    return <div class="row">
      <div class="col">
        <Select values={["All", "Unattributed"]} object={filter} field="filter" onchange={onFilterChanged} />
      </div>
    </div>
  }
}

export const ObservationListFilter = (props: ObservationListFilterComponentProps) => new ObservationListFilterComponent(props);