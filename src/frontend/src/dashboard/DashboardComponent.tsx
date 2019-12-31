import { UIElement, Component, UIContainer } from "../html/index";
import { PersonController } from "../persons";
import { IDisplayAdapter } from "../html/IDisplayAdapter";
import { DeadlineController } from "../deadlines";

interface DashboardProps {
  personController: PersonController,
  deadlineController: DeadlineController,
  onGenerateFakeData?: () => void,
  debug?: boolean
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
        {deadlines}
      </div>
    </div>;

    if (this.props.debug) {
      return <div>
        {component}
        <div class="row mt-5">
          <div class="col-sm">
            <button class="btn btn-info" onclick={this.props.onGenerateFakeData}>Generate fake data</button>
          </div>
          <div class="col-sm"></div>
        </div>
      </div>
    } else
      return component;
  }
}

export const Dashboard = (props: DashboardProps) => new DashboardComponent(props);

