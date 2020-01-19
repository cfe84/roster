import { Component } from "../html";
import { Template } from ".";
import { FilterFunction } from "../baseComponents/GenericController";
import { Select } from "../baseComponents";

export type TemplateToggleFilterValues = "All" | "Less than a week old";

export interface TemplateListFilterComponentProps {
  onFilterChanged: (filter: FilterFunction<Template>) => void;
  initialToggle: TemplateToggleFilterValues
}

export class TemplateListFilterComponent extends Component {
  constructor(private props: TemplateListFilterComponentProps) { super() }

  async render() {
    const filter = {
      toggle: this.props.initialToggle,
    };
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const calculateFilter = () =>
      (template: Template) => (filter.toggle === "All" || template.date.getTime() > aWeekAgo.getTime());

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

export const TemplateListFilter = (props: TemplateListFilterComponentProps) => new TemplateListFilterComponent(props);