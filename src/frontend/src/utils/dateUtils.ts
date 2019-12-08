export class dateUtils {
  public static format = (date: any): string =>
    date ? `${date.getYear() + 1900}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`
      : ""

  public static parseDate = (str: string | null): Date | null =>
    (str === null || str === undefined || str === "")
      ? null
      : new Date(Date.parse(str));
}