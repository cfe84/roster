export class AsyncTimeout {
  private id: number = 0;
  private promiseCallback?: () => void;
  private running = false;
  isRunning = (): boolean => this.running;
  constructor() { }
  sleepAsync = (timeMs: number): Promise<void> =>
    new Promise((resolve, reject) => {
      if (this.running) {
        reject(Error("Timeout already started"));
      } else {
        this.running = true;
        this.promiseCallback = resolve;
        this.id = setTimeout(() => {
          this.running = false;
          resolve()
        }, timeMs)
      }
    });

  abort = () => {
    clearTimeout(this.id);
    this.running = false;
    if (this.promiseCallback === undefined) {
      throw Error("Async timeout callback is undefined");
    }
    this.promiseCallback();
  }
}
