import DestinationInterface from "@/interfaces/destination.interface";
import { create } from "zustand";

// The destinations Page store (with zustand)

interface StoreType {
  destinations_list: DestinationInterface[];
  destinations_number: number;

  // actions
  set_many: (destinations: DestinationInterface[]) => void;
  add_destination: (destination: DestinationInterface) => void;
  remove_destination: (id: string) => void;
  remove_many_destinations: (ids: string[]) => void;
  update_destination: (id: string, destination: DestinationInterface) => void;

  set_total: (num: number) => void;
}

const useDestinationsStore = create<StoreType>((set) => ({
  destinations_list: [],
  destinations_number: 0,

  // set many
  set_many: (destinations) =>
    set(() => ({
      destinations_list: destinations,
    })),

  // actions
  add_destination: (destination) =>
    set((old) => ({
      destinations_list: [destination, ...old.destinations_list],
      destinations_number: old.destinations_number + 1,
    })),

  // remove destination
  remove_destination: (id) =>
    set((old) => ({
      destinations_list: old.destinations_list.filter((e) => e.id !== id),
      destinations_number: old.destinations_number - 1,
    })),

  // update destination
  update_destination: (id, destination) =>
    set((old) => ({
      destinations_list: old.destinations_list.map((e) =>
        e.id == id ? destination : e
      ),
    })),

  // remove many destinations
  remove_many_destinations: (ids) =>
    set((old) => ({
      destinations_list: old.destinations_list.filter(
        (e) => !ids.includes(e.id)
      ),
      destinations_number: old.destinations_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      destinations_number: num,
    })),
}));

export default useDestinationsStore;
