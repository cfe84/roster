import { UIElement, Component, UIContainer } from "../html/index";
import { PersonController } from "../persons";
import { IDisplayAdapter } from "../html/IDisplayAdapter";
import { DeadlineController } from "../deadlines";

interface DashboardProps {
  personController: PersonController,
  deadlineController: DeadlineController
}

export class DashboardComponent extends Component {
  constructor(public props: DashboardProps) { super() }

  public render = async (): Promise<UIElement> => {
    const peopleList = await this.props.personController.loadPeopleListAsync();
    const deadlines = await this.props.deadlineController.getDeadlineListAsync();
    const component: UIElement = <div class="row">
      <div class="col-sm">
        {peopleList}
      </div>
      <div class="col-sm">
        <h3>Deadlines</h3>
        {deadlines}
      </div>
    </div>;

    return component;
  }
}

export const Dashboard = (props: DashboardProps) => new DashboardComponent(props);

