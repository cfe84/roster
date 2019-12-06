import { UIElement, Component, UIContainer } from "../html/index";
import { PersonController } from "../persons";
import { IDisplayAdapter } from "../html/IDisplayAdapter";

interface DashboardProps {
  personController: PersonController,
}

export class DashboardComponent extends Component {
  constructor(public props: DashboardProps) { super() }

  public render = async (): Promise<UIElement> => {
    const peopleList = await this.props.personController.loadPeopleListAsync();

    const component: UIElement = <div class="row">
      <div class="col-sm">
        {peopleList}
      </div>
      <div class="col-sm">
        Stuff is gonna go there.
      </div>
    </div>;

    return component;
  }
}

export const Dashboard = (props: DashboardProps) => new DashboardComponent(props);

