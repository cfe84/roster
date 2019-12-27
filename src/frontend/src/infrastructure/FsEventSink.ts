import { default as fs, promises as fsAsync } from "fs";
import { EventBus, IEvent } from "../../lib/common/events";
import { default as path } from "path";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";

export class FsEventSink {
  constructor(private sinkPath: string, eventBus: EventBus) {
    fs.mkdirSync(sinkPath, { recursive: true });
    eventBus.subscribeToAllLocal(this.storeEventAsync);
  }

  private storeEventAsync = async (event: IEvent) => {
    const filePath = path.join(this.sinkPath, `${event.info.date.getTime()}-${event.info.eventId}.json`);
    const content = JsonSerializer.serialize(event);
    fsAsync.writeFile(filePath, content);
  }
}