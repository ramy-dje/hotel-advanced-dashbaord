import ReservationsInterface, {
  ReservationStatusType,
} from "@/interfaces/reservations.interface";
import { create } from "zustand";

// The reservations Page store (with zustand)

// store type
interface StoreType {
  reservations_list: ReservationsInterface[];
  reservations_number: number;
  selected_id: string | null;

  // actions
  set_many: (reservations: ReservationsInterface[]) => void;
  add_reservation: (reservation: ReservationsInterface) => void;
  remove_reservation: (id: string) => void;
  remove_many_reservations: (ids: string[]) => void;
  remove_all_reservations: () => void;
  update_reservation: (id: string, reservation: ReservationsInterface) => void;
  // change reservation status
  change_many_reservations_status: (
    ids: string[],
    status: ReservationStatusType
  ) => void;

  setSelectedReservation: (id: string | null) => void;
  set_total: (num: number) => void;
}

const useReservationsStore = create<StoreType>((set, get) => ({
  reservations_list: [],
  reservations_number: 0,
  selected_id: null,

  // set many
  set_many: (reservations) =>
    set(() => ({
      reservations_list: reservations,
    })),

  // actions
  add_reservation: (reservation) =>
    set((old) => ({
      reservations_list: [reservation, ...old.reservations_list],
      reservations_number: old.reservations_number + 1,
    })),

  // remove reservation
  remove_reservation: (id) =>
    set((old) => ({
      reservations_list: old.reservations_list.filter((e) => e.id !== id),
      reservations_number: old.reservations_number - 1,
    })),

  // remove many reservation
  remove_many_reservations: (ids) =>
    set((old) => ({
      reservations_list: old.reservations_list.filter(
        (e) => !ids.includes(e.id)
      ),
      reservations_number: old.reservations_number - ids.length,
    })),

  // remove all reservation
  remove_all_reservations: () =>
    set(() => ({
      reservations_list: [],
      reservations_number: 0,
    })),

  // update reservation
  update_reservation: (id, reservation) =>
    set((old) => ({
      reservations_list: old.reservations_list.map((e) =>
        e.id == id ? reservation : e
      ),
    })),

  // change many reservations status
  change_many_reservations_status: (ids, status) =>
    set((old) => ({
      reservations_list: old.reservations_list.map((e) =>
        ids.includes(e.id) ? { ...e, process: { ...e.process, status } } : e
      ),
    })),

  // set selected reservation
  setSelectedReservation: (id) =>
    set(() => ({
      selected_id: id,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      reservations_number: num,
    })),
}));

export default useReservationsStore;
