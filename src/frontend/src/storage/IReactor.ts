import { EventBus } from "../../lib/common/events";

export interface IReactor {
  registerReactors(eventBus: EventBus): void;
}