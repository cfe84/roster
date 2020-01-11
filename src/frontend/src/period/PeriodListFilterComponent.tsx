import { Component } from "../html";
import { Period } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select } from "../baseComponents";

export type PeriodToggleFilterValues = "All" | "Less than a week old";

export interface PeriodListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Period>) => void;
  initialToggle: PeriodToggleFilterValues
}

export class PeriodListFilterComponent extends Component {
  constructor(private props: PeriodListFilterComponentProps) { super() }

  async render() {
    const filter = {
      toggle: this.props.initialToggle,
    };
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const calculateFilter = () =>
      (period: Period) => (filter.toggle === "All" || period.startDate.getTime() > aWeekAgo.getTime());

    const onFilterChanged = () => {
      const filter = calculateFilter();
      this.props.onFilterChanged(filter);
    }
    setTimeout(() => onFilterChanged(), 100); // Dirty hack
    return <div class="row">
      <div class="col">
        <Select values={["All", "Less than a week old"]} object={filter} field="filter" onchange={onFilterChanged} />
      </div>
    </div>
  }
}

export const PeriodListFilter = (props: PeriodListFilterComponentProps) => new PeriodListFilterComponent(props);