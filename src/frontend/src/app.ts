import { StorePeopleChangesReactor, PersonController } from "./persons";
import { EventBus, IEvent } from "../lib/common/events";
import { IndexedDBStore } from "./infrastructure/IndexedDBStore";
import { NotesController, StoreNotesChangesReactor } from "./notes";
import { UIContainer } from "./html/UIContainer";
import { BrowserDisplayAdapter } from "./html/BrowserDisplayAdapter";
import { DashboardController } from "./dashboard/DashboardController";
import { FontAwesomeLoader } from "./utils/FontAwesomeLoader";
import { DiscussionController } from "./discussions";
import { StoreDiscussionsChangesReactor } from "./discussions/StoreDiscussionsChangesReactor";
import { DeadlineController } from "./deadlines";
import { StoreDeadlinesChangesReactor } from "./deadlines/StoreDeadlinesChangesReactor";
import { SocketReplicationAdapter } from "./infrastructure/SocketReplicationAdapter";
import { ReplicationManager } from "./synchronization/ReplicationManager";
import { LocalStorageQueue } from "./infrastructure/LocalStorageQueue";
import { clientIdUtil } from "./utils/clientId";
import { GUID } from "../lib/common/utils/guid";
import { Token } from "../lib/common/authorization";
import { IWholeStore } from "./infrastructure/IWholeStore";
import { FsStore } from "./infrastructure/FsStore";

const getSocketUrl = () => {
  if (window.location.protocol === "file:") {
    return "http://localhost:3501";
  } else {
    return window.location.href;
  }
}

export interface AppParams {
  store?: string,
  sync?: string,
  debug?: string,
  file?: string,
}

export class App {
  private eventBus: EventBus;
  private clientId: string;
  private sessionId: string = GUID.newGuid();
  private storeType: string;
  private file: string;
  private debug: boolean;
  private sync: boolean;
  constructor({ store, sync, debug, file }: AppParams) {
    this.storeType = store || "IndexedDB";
    this.sync = sync !== "false";
    this.debug = debug === "true";
    this.file = file || "";
    this.clientId = clientIdUtil.getClientId();
    this.eventBus = new EventBus(this.clientId);
  }

  notesController?: NotesController;
  discussionController?: DiscussionController;
  deadlineController?: DeadlineController;
  personController?: PersonController;
  dashboardController?: DashboardController;

  async loadAsync(): Promise<void> {
    try {
      const dbStore = await this.loadDbAsync();
      this.loadReactors(dbStore);
      this.loadUI(dbStore);
      await this.loadReplicationManager();
    }
    catch (error) {
      console.error(error);
    }
  }

  private async loadDbAsync(): Promise<IWholeStore> {
    switch (this.storeType) {
      case "fs":
      // return await FsStore.loadAsync(this.file);
      case "IndexedDb":
      default:
        return await IndexedDBStore.OpenDbAsync();
    }
  }

  private async loadReplicationManager() {
    if (this.sync) {
      console.log("Loading replication manager");
      const token = new Token();
      const replicationAdapter = new SocketReplicationAdapter(getSocketUrl(), token, this.clientId.toString());
      const queue = new LocalStorageQueue<IEvent>();
      const replicationManager = new ReplicationManager({
        adapter: replicationAdapter, eventBus: this.eventBus, queue
      }, true);
      await replicationManager.startSyncingAsync();
    }
  }

  private loadUI(dbStore: IWholeStore) {
    const displayAdapter = new BrowserDisplayAdapter();
    const mainContainer = displayAdapter.getElementFromDom("container-main");
    const uiContainer = new UIContainer({
      displayAdapter,
      container: mainContainer
    });
    this.notesController = new NotesController({ uiContainer, db: dbStore, eventBus: this.eventBus });
    this.discussionController = new DiscussionController({ db: dbStore, eventBus: this.eventBus, uiContainer });
    this.deadlineController = new DeadlineController({ db: dbStore, eventBus: this.eventBus, uiContainer });
    this.personController = new PersonController(this.eventBus, uiContainer, dbStore, this.notesController, this.discussionController, this.deadlineController);
    this.dashboardController = new DashboardController({
      container: uiContainer,
      deadlineController: this.deadlineController,
      personController: this.personController
    });
    this.dashboardController.displayDashboard();
  }

  private loadReactors(dbStore: IWholeStore) {
    const peopleReactor = new StorePeopleChangesReactor(dbStore);
    peopleReactor.registerReactors(this.eventBus);
    const notesReactor = new StoreNotesChangesReactor(dbStore);
    notesReactor.registerReactors(this.eventBus);
    const discussionReactor = new StoreDiscussionsChangesReactor(dbStore);
    discussionReactor.registerReactors(this.eventBus);
    const deadlineReactor = new StoreDeadlinesChangesReactor(dbStore);
    deadlineReactor.registerReactors(this.eventBus);
  }
}

class QueryParams {
  [name: string]: string
}
const parseQueryParams = (params: string): QueryParams => {
  if (!params) return {};
  const result: QueryParams = {};
  if (params.startsWith("?")) {
    params = params.substring(1, params.length);
  }
  const splits = params.split("&").map((param) => param.split("="));
  splits.forEach((split) => result[split[0]] = split[1]);
  return result;
}

export function test() {
  console.log("toto")
}

window.onload = () => {
  const params = parseQueryParams(window.location.search);
  console.log(params);
  const app = new App(params);
  FontAwesomeLoader.loadFontAwesome();
  app.loadAsync().then(() => { });
}

export {
  IWholeStore,
}