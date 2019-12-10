import moment = require("moment");

export class dateUtils {
  public static format = (date: any): string => {
    return (!!date) ? moment(date).format("YYYY-MM-DD")
      : ""
  }

  public static parseDate = (str: string | null): Date | null =>
    (str === null || str === undefined || str === "")
      ? null
      : moment(str).toDate();
}