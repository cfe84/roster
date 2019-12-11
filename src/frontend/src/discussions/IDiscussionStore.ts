import { Discussion } from ".";

export interface IDiscussionStore {
  getDiscussionsAsync(): Promise<Discussion[]>;
  createDiscussionAsync(element: Discussion): Promise<void>;
  updateDiscussionAsync(element: Discussion): Promise<void>;
  deleteDiscussionAsync(element: Discussion): Promise<void>;
}