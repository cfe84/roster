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
import { IWholeStore } from "./storage/IWholeStore";
import { FsStore } from "./infrastructure/FsStore";
import path from "path";
import { FsEventSink } from "./infrastructure/FsEventSink";
import { ILogger } from "./log/ILogger";
import { NullLogger } from "./log/NullLogger";
import { IFakeGenerator } from "./storage/IFakeGenerator";
import { FakePersonGenerator } from "./persons/FakePersonGenerator";
import { ActionController } from "./actions";
import { AlertController } from "./alerts/AlertController";
import { ActionStorageReactors } from "./actions/ActionStorageReactors";

const LAST_OPENED_FILE_KEY = "roster.config.lastOpenedFile";
const DEFAULT_FILE_NAME = "roster.json";

export interface AppParams {
  store?: string,
  sync?: string,
  debug?: string,
  file?: string,
  showNavbar?: string,
  logEvents?: string
}

export class App {
  private logger: ILogger;
  private eventBus: EventBus;
  private clientId: string;
  private storeType: string;
  private file: string;
  private showNavbar: boolean;
  private sync: boolean;
  private logEvents: boolean;
  private debug: boolean;
  constructor(params: AppParams) {
    this.debug = params.debug === "true";
    this.logger = this.loadLogger(this.debug);
    this.logger.log(`Loading app with parameters: ${JSON.stringify(params, null, 2)}`);
    this.storeType = params.store || "IndexedDB";
    this.sync = params.sync !== "false";
    this.showNavbar = params.showNavbar !== "false";
    this.file = params.file || "";
    this.clientId = clientIdUtil.getClientId();
    this.eventBus = new EventBus(this.clientId, params.debug === "true");
    this.logEvents = params.logEvents === "true"
  }

  notesController?: NotesController;
  actionController?: ActionController;
  discussionController?: DiscussionController;
  deadlineController?: DeadlineController;
  personController?: PersonController;
  dashboardController?: DashboardController;

  private loadLogger(debug: boolean): ILogger {
    if (debug) {
      return console;
    }
    else {
      return new NullLogger();
    }
  }

  async loadAsync(): Promise<void> {
    try {
      FontAwesomeLoader.loadFontAwesome();
      this.handleNavbar();
      const dbStore = await this.loadDbAsync();
      this.loadReactors(dbStore);
      this.loadUI(dbStore);
      await this.loadReplicationManager();
      this.loadEventSink(this.eventBus);
    }
    catch (error) {
      console.error(error);
    }
  }

  private handleNavbar() {
    if (!this.showNavbar) {
      const element = document.getElementById("navbar");
      if (element) {
        element.outerHTML = "";
      }
    }
  }

  private async loadDbAsync(): Promise<IWholeStore> {
    this.logger.log(`Loading db: ${this.storeType}`);
    switch (this.storeType) {
      case "fs":
        return await this.openFileAsync();
      case "IndexedDb":
      default:
        return await IndexedDBStore.OpenDbAsync();
    }
  }

  private openFileAsync = async (): Promise<FsStore> => {
    this.logger.log(`Loading from file`);
    if (!this.file) {
      this.logger.log(`No file specified, loading last opened file`);
      this.loadLastOpenedFile();
    }
    this.saveLastOpenedFile();
    this.logger.log(`Opening ${this.file}`);
    return await FsStore.loadAsync(this.file);
  }

  private saveLastOpenedFile() {
    localStorage.setItem(LAST_OPENED_FILE_KEY, this.file);
  }

  private loadLastOpenedFile() {
    this.file = localStorage.getItem(LAST_OPENED_FILE_KEY) || DEFAULT_FILE_NAME;
  }

  private loadEventSink(eventBus: EventBus) {
    if (this.logEvents) {
      const ext = path.extname(this.file);
      const filename = path.basename(this.file);
      const fileroot = filename.replace(ext, "");
      const eventSinkPath = `${path.dirname(this.file)}/${fileroot}`;
      this.logger.log(`Loading event sink to ${eventSinkPath}`);
      const eventSink = new FsEventSink(eventSinkPath, eventBus);
    } else {
      this.logger.log(`Event sink is disabled`);
    }
  }

  private async loadReplicationManager() {
    if (this.sync) {
      const socketUrl = (window.location.protocol === "file:") ? "http://localhost:3501" : window.location.href;
      this.logger.log(`Loading replication manager to ${socketUrl}`)
      const replicationAdapter = new SocketReplicationAdapter(socketUrl, "token", this.clientId.toString());
      const queue = new LocalStorageQueue<IEvent>();
      const replicationManager = new ReplicationManager({
        adapter: replicationAdapter, eventBus: this.eventBus, queue
      }, true);
      await replicationManager.startSyncingAsync();
    } else {
      this.logger.log(`Replication manager is disabled`)
    }
  }

  private createFakeGenerator(): IFakeGenerator {
    return new FakePersonGenerator();
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
    this.actionController = new ActionController({ db: dbStore, eventBus: this.eventBus, uiContainer });
    this.deadlineController = new DeadlineController({ db: dbStore, eventBus: this.eventBus, uiContainer });
    this.personController = new PersonController({
      eventBus: this.eventBus, uiContainer, db: dbStore,
      notesController: this.notesController, discussionController: this.discussionController, deadlineController: this.deadlineController,
      actionController: this.actionController
    });
    this.dashboardController = new DashboardController({
      container: uiContainer,
      deadlineController: this.deadlineController,
      actionController: this.actionController,
      personController: this.personController,
      debug: this.debug,
      eventBus: this.eventBus,
      fakeGenerator: this.createFakeGenerator()
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
    const actionReactor = new ActionStorageReactors(dbStore);
    actionReactor.registerReactors(this.eventBus);
  }

  public handleError = () => {
    const displayAdapter = new BrowserDisplayAdapter();
    const container = displayAdapter.getElementFromDom("container-alerts");
    const uiContainer = new UIContainer({
      displayAdapter,
      container: container
    });
    const controller = new AlertController({ container: uiContainer, debug: this.debug })
    return (error: string | Event) => {
      switch (typeof error) {
        case "string":
          controller.showAlert(error);
          break;
        default:
          controller.showAlert(`${error}`);
      }
    }
  }
}

export {
  IWholeStore
}

class QueryParams {
  [index: string]: string
}

const parseQueryParams = (params: string): QueryParams => {
  if (!params) return {};
  const result: QueryParams = {};
  if (params.startsWith("?")) {
    params = params.substring(1, params.length);
  }
  const splits = params.split("&").map((param) => param.split("="));
  splits.forEach((split) => result[decodeURIComponent(split[0])] = decodeURIComponent(split[1]));
  return result;
}

window.onload = () => {
  const params = parseQueryParams(window.location.search);
  const app = new App(params);
  window.onerror = app.handleError();
  app.loadAsync().then(() => { });
}