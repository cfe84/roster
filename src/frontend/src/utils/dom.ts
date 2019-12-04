export class dom {
  static getInputValue(elementId: string): string {
    const element = document.getElementById(elementId) as HTMLInputElement;
    if (element) {
      return element.value;
    } else {
      throw Error(`Element not found: ${elementId}`);
    }
  }
}