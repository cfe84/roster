import { EventBus } from "../../lib/common/events";

export interface IFakeGenerator {
  generateAsync(eventBus: EventBus): Promise<void>;
}