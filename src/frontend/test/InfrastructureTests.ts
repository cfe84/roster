import * as td from "testdouble";
import { LocalStorageQueue, ILocalStorage } from "../src/infrastructure/LocalStorageQueue";
import should from "should";

class FakeLocalStorage implements ILocalStorage {
  private store: any = {}
  getItem(key: string): string | null {
    return this.store[key];
  }
  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
}

describe("Infrastructure", () => {
  context("LocalStorageQueue", () => {
    it("should return count 0", async () => {
      // given
      const queue = new LocalStorageQueue(new FakeLocalStorage());

      // when
      const count = await queue.countAsync();

      // then
      should(count).eql(0);
    });

    it("should count and read items when pushing in new or empty queue", async () => {
      // given
      const queue = new LocalStorageQueue(new FakeLocalStorage());
      const item = { id: 1 };

      for (let i = 0; i < 5; i++) {
        // when
        await queue.pushAsync(item);
        const count = await queue.countAsync();
        const retrieved = await queue.peekAsync();
        await queue.deleteAsync(retrieved);

        // then
        should(count).eql(1);
        should(retrieved.data).deepEqual(item);
        should(await queue.countAsync()).eql(0);
      }
    });

    it("should handle multiple messages", async () => {
      // given
      const queue = new LocalStorageQueue<any>(new FakeLocalStorage());
      const items = [];
      const totalMessageCount = 100;
      for (let i = 0; i < totalMessageCount; i++) {
        items.push({ id: i });
      }

      // when, then
      for (let i = 0; i < items.length; i++) {
        should(await queue.countAsync()).eql(i);
        await queue.pushAsync(items[i]);
      }
      let count = 0;
      while (await queue.countAsync() > 0) {
        const msg = await queue.peekAsync();
        should((msg.data as any).id).eql(count);
        await queue.deleteAsync(msg);
        count++;
      }
      should(count).eql(totalMessageCount);
    });

    it("should throw when deleting a message that is not top of queue", async () => {
      // given
      const queue = new LocalStorageQueue(new FakeLocalStorage());
      const item1 = { id: 1 };
      const item2 = { id: 2 };

      // when
      await queue.pushAsync(item1);
      await queue.pushAsync(item2);
      const retrieved1 = await queue.peekAsync();
      const retrieved2 = await queue.peekAsync();
      await queue.deleteAsync(retrieved1);

      // then
      await should(queue.deleteAsync(retrieved1)).be.rejected();
    })
  })
})