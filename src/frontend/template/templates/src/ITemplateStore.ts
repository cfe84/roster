import { Template } from "./Template";
import { IStore } from "../storage/IStore";

export interface ITemplateStore {
  getTemplatesAsync(): Promise<Template[]>;
  createTemplateAsync(element: Template): Promise<void>;
  updateTemplateAsync(element: Template): Promise<void>;
  deleteTemplateAsync(element: Template): Promise<void>;
}

export class TemplateStoreAdapter implements IStore<Template> {
  constructor(private store: ITemplateStore) { }
  getAsync = this.store.getTemplatesAsync;
  createAsync = this.store.createTemplateAsync;
  updateAsync = this.store.deleteTemplateAsync;
}