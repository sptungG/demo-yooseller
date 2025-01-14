import { default as _dayjs } from "dayjs";
import "dayjs/locale/vi";
import calendar from "dayjs/plugin/calendar";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
// import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
import { DateISO } from "src/types/global.types";

_dayjs.locale("vi");
// _dayjs.extend(utc);
_dayjs.extend(weekday);
_dayjs.extend(calendar);
_dayjs.extend(isBetween);
_dayjs.extend(updateLocale);
_dayjs.extend(customParseFormat);
_dayjs.extend(relativeTime);
_dayjs.extend(isSameOrAfter);
_dayjs.extend(isSameOrBefore);

_dayjs.updateLocale("vi", {
  calendar: {
    sameDay: "[Hôm nay lúc] HH:mm", // The same day ( Today at 2:30)
    nextDay: "[Ngày mai lúc] HH:mm", // The next day ( Tomorrow at 2:30)
    lastDay: "[Hôm qua lúc] HH:mm", // The day before ( Yesterday at 2:30)
    nextWeek: "HH:mm DD-MM-YYYY", // The next week ( Sunday at 2:30)
    lastWeek: "HH:mm DD-MM-YYYY", // Last week ( Last Monday at 2:30)
    sameElse: "HH:mm DD-MM-YYYY", // Everything else ( 17/10/2011 )
  },
});

export const dayjs = _dayjs;

export const dateFormat = "DD-MM-YYYY";
export const timeFormat = "HH:mm:ss";
export const dateTimeFormat = "HH:mm:ss DD/MM/YYYY";
export const dateFormatVoucher = "DD-MM-YYYY HH:mm";
export const dateFormatVoucher1 = "HH:mm DD/MM/YYYY";

export const formatFromNow = (date: DateISO) => dayjs(date).fromNow();

export const formatDate = (date: DateISO | number, format = dateFormat) =>
  typeof date === "number" ? dayjs.unix(date).format(format) : dayjs(date).format(format);

export const formatDateTime = (datetime: DateISO | number, format = dateTimeFormat) =>
  typeof datetime === "number"
    ? dayjs.unix(datetime).format(format)
    : dayjs(datetime).format(format);

export const isSameTime = (date1?: DateISO, date2?: DateISO, unit?: any) => {
  if (!date1 || !date2) return false;
  return dayjs(date1).isSame(dayjs(date2), unit);
};

export const isBetweenDate = (date: DateISO, fromDate: DateISO, toDate: DateISO) =>
  dayjs(date).isBetween(fromDate, toDate);

export const sorterByDate =
  <T extends Record<string, any>>(sorterKey: keyof T) =>
  (a: T, b: T) =>
    dayjs(b[sorterKey]).valueOf() - dayjs(a[sorterKey]).valueOf();

export const isAfterDate = (fromDate: any, toDate: any) => {
  return dayjs(fromDate).isAfter(dayjs(toDate));
};
