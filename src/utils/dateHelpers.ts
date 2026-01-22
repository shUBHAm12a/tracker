import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isToday,
  parseISO,
} from "date-fns";

export const getWeekDates = (startDate: Date | string) => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const weekStart = startOfWeek(start, { weekStartsOn: 1 });

  return Array.from({ length: 7 }, (_, i) => ({
    date: addDays(weekStart, i),
    isToday: isToday(addDays(weekStart, i)),
  }));
};

export const formatDate = (date: Date) => {
  return format(date, "MMM d");
};

export const formatDayName = (date: Date) => {
  return format(date, "EEE");
};

export const getToday = () => {
  return new Date();
};

export const toDateString = (date: Date) => {
  return format(date, "yyyy-MM-dd");
};

export const getWeekStart = (date: Date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export { addWeeks, subWeeks, addDays };
