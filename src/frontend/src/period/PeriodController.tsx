import { IPeriodStore, Period } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer, UIElement, Component } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { PeriodComponentFactory, PeriodListFilterComponentOptions } from "./PeriodComponentFactory";
import { PeriodEventFactory } from "./PeriodEventFactory";
import { PeriodStoreAdapter } from "./IPeriodStore";
import { EvaluationCriteriaController } from "../evaluationCriteria";
import { ObservationController } from "../observation";

export interface PeriodControllerDependencies {
  db: IPeriodStore,
  eventBus: EventBus,
  uiContainer: UIContainer,
  evaluationCriteriaController: EvaluationCriteriaController,
  observationController: ObservationController
}

type PeriodFilter = (action: Period) => boolean;

export class PeriodController {
  private genericController: GenericController<Period>;
  constructor(private deps: PeriodControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Period> = {
      componentFactory: new PeriodComponentFactory({
        eventBus: this.deps.eventBus,
        evaluationCriteriaController: this.deps.evaluationCriteriaController,
        observationController: this.deps.observationController
      }),
      eventFactory: new PeriodEventFactory(),
      db: new PeriodStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.genericController = new GenericController(genericControllerDependencies);
  }

  public getMyListComponentAsync = async () => {
    return await this.getPeriodListComponentAsync((action: Period) => true, undefined);
  }

  public getPersonListComponentAsync = async (personId: string) => {
    return await this.getPeriodListComponentAsync((action: Period) => action.personId === personId, personId);
  }

  private getPeriodListComponentAsync = async (filter: PeriodFilter, personId?: string) => {
    const sort = (a: Period, b: Period) => a.name > b.name ? 1 : -1;
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const generator = personId ? (() => new Period(personId)) : undefined;
    const filterComponentOptions: PeriodListFilterComponentOptions = {
      initialToggle: "All",
    }
    return await this.genericController.getListAsync({
      entityGenerator: generator,
      filter,
      sort,
      icon: "calendar-alt",
      iconClass: "r",
      title: "Periods",
      filterComponentOptions,
    });
  }
}
