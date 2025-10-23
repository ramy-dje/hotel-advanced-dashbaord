import { create } from "zustand";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";

// The Rate Seasons P age store (with zustand)

interface StoreType {
  seasons_list: RatePlanSeasonInterface[];
  seasons_number: number;

  // actions
  set_many: (seasons: RatePlanSeasonInterface[]) => void;
  add_season: (season: RatePlanSeasonInterface) => void;
  remove_season: (id: string) => void;
  remove_many_seasons: (ids: string[]) => void;
  update_season: (id: string, season: RatePlanSeasonInterface) => void;

  set_total: (num: number) => void;
}

const useRateSeasonsStore = create<StoreType>((set) => ({
  seasons_list: [],
  seasons_number: 0,

  // set many
  set_many: (seasons) =>
    set(() => ({
      seasons_list: seasons,
    })),

  // actions
  add_season: (season) =>
    set((old) => ({
      seasons_list: [...old.seasons_list, season],
      seasons_number: old.seasons_number + 1,
    })),

  // remove season
  remove_season: (id) =>
    set((old) => ({
      seasons_list: old.seasons_list.filter((e) => e.id !== id),
      seasons_number: old.seasons_number - 1,
    })),

  // update season
  update_season: (id, season) =>
    set((old) => ({
      seasons_list: old.seasons_list.map((e) =>
        e.id == id ? season : e
      ),
    })),

  // remove many seasons
  remove_many_seasons: (ids) =>
    set((old) => ({
      seasons_list: old.seasons_list.filter((e) => !ids.includes(e.id)),
      seasons_number: old.seasons_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      seasons_number: num,
    })),
}));

export default useRateSeasonsStore;
