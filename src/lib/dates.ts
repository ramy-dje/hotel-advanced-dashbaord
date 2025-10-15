// Fixes the time zone
export const getTimezoneOffsetFixer = (d: Date) =>
  new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60000);

// get days number between dates calculator
export const daysNumberBetweenDatesCalculator = (
  date1: Date | string,
  date2: Date | string
) => {
  return Math.round(
    ((new Date(date2).getTime() as any) - (new Date(date1).getTime() as any)) /
      (1000 * 60 * 60 * 24) +
      1
  );
};

// get all days between two dates
export const getAllDaysBetweenDates = (
  date1: Date | string,
  date2: Date | string
) => {
  const days = [];
  const last = new Date(date2);
  let current = new Date(date1);
  // check if the date 2 is less then the date 1
  if (last < current) {
    throw new Error("Date 2 is less then date 1");
  }
  while (current <= last) {
    days.push(new Date(current));
    // add day to current
    current.setDate(current.getDate() + 1);
  }
  // return the days
  return days;
};
