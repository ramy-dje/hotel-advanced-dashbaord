import RoomInterface from "@/interfaces/room.interface";
import { isWithinInterval } from "date-fns";
import { getAllDaysBetweenDates, getTimezoneOffsetFixer } from "./dates";

// rooms price calculator
export const RoomsPriceCalculator = (
  check: { in: Date; out: Date },
  prices: RoomInterface["price"],
  rooms_number: number = 1,
  default_price: number
) => {
  // getting all the days between the check in and check out
  const days = getAllDaysBetweenDates(check.in, check.out);

  // calc the total price and multiplying the prices by the number of rooms.

  const all_days = (() => {
    // if the check.in and out are not the same remove the last (day) item from the array
    if (new Date(check.in).getDate() !== new Date(check.out).getDate())
      return days.slice(0, -1);
    else return days;
  })()
    .map((day) => {
      // looking for the price of this day
      const result = prices.find((p) => {
        return isWithinInterval(getTimezoneOffsetFixer(new Date(day)), {
          start: new Date(p.from),
          end: new Date(p.to),
        });
      });
      // if the price doesn't exist we give it the first price in the array of the prices
      const price = result ? result.price : default_price || prices[0].price;

      // returning the price
      return price;
    })
    .reduce((a, b) => a + b, 0);

  // total price
  const total_prices = all_days * rooms_number;

  // returning the total
  return total_prices;
};

// extra service price calculator
export const ExtraServicePriceCalculator = (
  chosen: { service: string; guests: number }[],
  all_extra_services: RoomInterface["extra_services"]
) => {
  // calc the extra services price
  const chosen_extra_services_ids = chosen.map((e) => e.service);
  // filter the extra_services
  const extra_services = all_extra_services.filter((ex) =>
    chosen_extra_services_ids.includes(ex.id)
  );
  // calc the price
  const extra_services_price = extra_services
    .map((e) => {
      const service = chosen.find((f) => f.service == e.id)!;
      // calc the price
      return service.guests * e.price;
    })
    .reduce((a, b) => a + b);

  // return the total extra services price
  return extra_services_price;
};
