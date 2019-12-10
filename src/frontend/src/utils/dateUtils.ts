import moment = require("moment");

const dateValidation = /^(\d{4})[- /](\d{1,2})[- /](\d{1,2})$/;

export class dateUtils {
  public static format = (date: any): string => {
    return (!!date) ? moment(date).format("YYYY-MM-DD")
      : ""
  }

  public static parseDate = (str: string | null): Date | null =>
    (str === null || str === undefined || str === "")
      ? null
      : moment(str).toDate();

  public static isValidDate = (str: string): boolean => {
    if (str === null || str === "") {
      return true;
    }
    if (!dateValidation.test(str)) {
      return false;
    }
    return moment(Date.parse(str)).isValid();
  }

}