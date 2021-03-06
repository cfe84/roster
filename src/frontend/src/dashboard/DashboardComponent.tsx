import { UIElement, Component, UIContainer } from "../html/index";
import { PersonController } from "../persons";
import { IDisplayAdapter } from "../html/IDisplayAdapter";
import { DeadlineController } from "../deadlines";
import { ActionController } from "../actions";
import { Button } from "../baseComponents";

interface DashboardProps {
  personController: PersonController,
  deadlineController: DeadlineController,
  actionController: ActionController,
  onGenerateFakeData?: () => void,
  onConfigurationClicked: () => void,
  debug?: boolean
}

export class DashboardComponent extends Component {
  constructor(public props: DashboardProps) { super() }

  public render = async (): Promise<UIElement> => {
    const peopleList = await this.props.personController.loadPeopleListAsync();
    const actions = await this.props.actionController
      .getMyActionsListComponentAsync();
    const deadlines = await this.props.deadlineController.getDeadlineListAsync();
    const component: UIElement = <div class="row">
      <div class="col-sm">
        {peopleList}
        <div class="mt-5">
          <Button icon="cog" text="Open configuration" onclick={this.props.onConfigurationClicked}></Button>
        </div>
      </div>
      <div class="col-sm">
        {actions}
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

