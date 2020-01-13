import { UIElement, Component, UIContainer } from "../html/index";
import { PageTitle } from "../baseComponents";
import { EvaluationCriteriaController } from "../evaluationCriteria";

interface ConfigurationProps {
  evaluationCriteriaController: EvaluationCriteriaController,
  onGenerateFakeData?: () => void,
  onBack: () => void,
  debug?: boolean
}

export class ConfigurationComponent extends Component {
  constructor(public props: ConfigurationProps) { super() }

  public render = async (): Promise<UIElement> => {
    const evaluationCriteriaList = await this.props.evaluationCriteriaController.getEvaluationCriteriaListComponentAsync();
    const component: UIElement = <div>
      <PageTitle title="Configuration" icon="cog" onBack={this.props.onBack} />
      <div class="row">
        <div class="col-sm">
          {evaluationCriteriaList}
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

