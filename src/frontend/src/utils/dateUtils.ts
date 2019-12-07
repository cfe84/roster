export class dateUtils {
  public static format = (date: any): string =>
    `${date.getYear() + 1900}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}