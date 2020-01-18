import { ITemplateStore, Template } from ".";
import { EventBus } from "../../lib/common/events";
import { UIContainer } from "../html";
import { GenericController, GenericControllerDependencies } from "../baseComponents/GenericController";
import { TemplateComponentFactory, TemplateListFilterComponentOptions } from "./TemplateComponentFactory";
import { TemplateEventFactory } from "./TemplateEventFactory";
import { TemplateStoreAdapter } from "./ITemplateStore";

export interface TemplateControllerDependencies {
  db: ITemplateStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

type TemplateFilter = (action: Template) => boolean;

export class TemplateController {
  private controller: GenericController<Template>;
  constructor(private deps: TemplateControllerDependencies) {
    const genericControllerDependencies: GenericControllerDependencies<Template> = {
      componentFactory: new TemplateComponentFactory({ eventBus: this.deps.eventBus }),
      eventFactory: new TemplateEventFactory(),
      db: new TemplateStoreAdapter(deps.db),
      eventBus: deps.eventBus,
      uiContainer: deps.uiContainer,
    }
    this.controller = new GenericController(genericControllerDependencies);
  }

  public getMyListComponentAsync = async () => {
    return await this.getTemplateListComponentAsync((template: Template) => true, undefined);
  }

  public getPersonListComponentAsync = async (personId: string) => {
    return await this.getTemplateListComponentAsync((template: Template) => template.personId === personId, personId);
  }

  private getTemplateListComponentAsync = async (filter: TemplateFilter, personId?: string) => {
    const sort = (a: Template, b: Template) => a.title > b.title ? 1 : -1;
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);
    const generator = personId ? (() => new Template(personId)) : undefined;
    const filterComponentOptions: TemplateListFilterComponentOptions = {
      initialToggle: "All",
    }
    return await this.controller.getListAsync({
      entityGenerator: generator,
      filter,
      sort,
      icon: "tasks",
      title: "Templates",
      filterComponentOptions
    });
  }
}
