import { IAccountEventStore } from "../Storage/IAccountEventStore";
import { IEvent } from "../../lib/common/events";
import { TableService, TableUtilities, TableQuery } from "azure-storage";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";

const entGen = TableUtilities.entityGenerator;

interface tableEntity {
  PartitionKey: TableUtilities.entityGenerator.EntityProperty<string>,
  RowKey: TableUtilities.entityGenerator.EntityProperty<string>,
  type: TableUtilities.entityGenerator.EntityProperty<string>,
  eventReceivedDateTime: TableUtilities.entityGenerator.EntityProperty<Date>,
  eventId: TableUtilities.entityGenerator.EntityProperty<string>,
  objectType: TableUtilities.entityGenerator.EntityProperty<string>,
  objectId: TableUtilities.entityGenerator.EntityProperty<string>,
  eventVersion: TableUtilities.entityGenerator.EntityProperty<number>,
  emitterId: TableUtilities.entityGenerator.EntityProperty<string>,
  event: TableUtilities.entityGenerator.EntityProperty<string>
}

export class TableStorageEventStore implements IAccountEventStore {

  constructor(private tableService: TableService, private tableName: string) { }

  generateEntity(event: IEvent): tableEntity {
    const serializedEvent = JsonSerializer.serialize(event);
    return {
      PartitionKey: entGen.String(event.info.date.getTime().toString()),
      RowKey: entGen.String(event.info.eventId),
      type: entGen.String(event.info.type),
      eventReceivedDateTime: entGen.DateTime(event.info.date),
      eventId: entGen.String(event.info.eventId),
      objectType: entGen.String(event.info.objectType),
      objectId: entGen.String(event.info.objectId),
      eventVersion: entGen.Int32(event.info.eventVersion),
      emitterId: entGen.String(event.info.emitterId || ""),
      event: entGen.String(serializedEvent)
    };
  }

  storeEventAsync(event: IEvent): Promise<void> {
    return new Promise((resolve, reject) => {
      const entity: tableEntity = this.generateEntity(event);
      console.log(entity);
      this.tableService.insertEntity(this.tableName, entity, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      })
    });
  }

  getEventsAsync(fromDate: number): Promise<IEvent[]> {
    return new Promise((resolve, reject) => {
      const query = new TableQuery().where("PartitionKey gt ?", fromDate);
      let res: IEvent[] = [];
      let continuationToken = null as unknown as TableService.TableContinuationToken;
      do {
        this.tableService.queryEntities(this.tableName, query, continuationToken, (error: any, result: any, response: any) => {
          if (error) {
            reject(error);
            return;
          }
          const entities = result.entries as tableEntity[];
          res = res.concat(entities.map((res: tableEntity) => JsonSerializer.deserialize(res.event._)));
          if (result.continuationToken) {
            continuationToken = result.continuationToken;
          } else {
            resolve(res);
            return;
          }
        });
      } while (continuationToken !== null)
    })
  }


}