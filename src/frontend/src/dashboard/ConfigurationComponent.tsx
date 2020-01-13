import { UIElement, Component, UIContainer } from "../html/index";
import { PageTitle } from "../baseComponents";
import { RatingCriteriaController } from "../ratingCriteria";

interface ConfigurationProps {
  ratingCriteriaController: RatingCriteriaController,
  onGenerateFakeData?: () => void,
  onBack: () => void,
  debug?: boolean
}

export class ConfigurationComponent extends Component {
  constructor(public props: ConfigurationProps) { super() }

  public render = async (): Promise<UIElement> => {
    const ratingCriteriaList = await this.props.ratingCriteriaController.getRatingCriteriaListComponentAsync();
    const component: UIElement = <div>
      <PageTitle title="Configuration" icon="cog" onBack={this.props.onBack} />
      <div class="row">
        <div class="col-sm">
          {ratingCriteriaList}
        </div>
        <div class="col-sm">
        </div>
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

export const Configuration = (props: ConfigurationProps) => new ConfigurationComponent(props);

