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
import { ReplicationManager, ReplicationManagerDependencies } from "./synchronization/ReplicationManager";
import { LocalStorageQueue } from "./infrastructure/LocalStorageQueue";

class App {
  private eventBus: EventBus = new EventBus(true);

  constructor() {

  }

  notesController?: NotesController;
  discussionController?: DiscussionController;
  deadlineController?: DeadlineController;
  personController?: PersonController;
  dashboardController?: DashboardController;

  async loadAsync(): Promise<void> {
    try {

      const dbStore = await IndexedDBStore.OpenDbAsync();
      this.loadReactors(dbStore);
      this.loadUI(dbStore);
      const replicationAdapter = new SocketReplicationAdapter("https://roster.feval.ca", "12314");
      const queue = new LocalStorageQueue<IEvent>();
      const replicationManager = new ReplicationManager({
        adapter: replicationAdapter, eventBus: this.eventBus, queue
      });
      await replicationManager.startSyncingAsync();
    }
    catch (error) {
      console.error(error);
    }
  }

  private loadUI(dbStore: IndexedDBStore) {
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

  private loadReactors(dbStore: IndexedDBStore) {
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

window.onload = () => {
  const app = new App();
  FontAwesomeLoader.loadFontAwesome();
  app.loadAsync().then(() => { });
}