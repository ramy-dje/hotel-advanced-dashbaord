import { create } from "zustand";
import { FeeInterface } from "@/interfaces/fees.interface";

// The Taxes Page store (with zustand)

interface StoreType {
  fees_list: FeeInterface[];
  fees_number: number;

  // actions
  set_many: (fees: FeeInterface[]) => void;
  add_fee: (fee: FeeInterface) => void;
  remove_fee: (id: string) => void;
  remove_many_fees: (ids: string[]) => void;
  update_fee: (id: string, tax: FeeInterface) => void;

  set_total: (num: number) => void;
}

const useFeesStore = create<StoreType>((set) => ({
  fees_list: [],
  fees_number: 0,

  // set many
  set_many: (fees) =>
    set(() => ({
      fees_list: fees,
    })),

  // actions
  add_fee: (fee) =>
    set((old) => ({
      fees_list: [...old.fees_list, fee],
      fees_number: old.fees_number + 1,
    })),

  // remove category
  remove_fee: (id) =>
    set((old) => ({
      fees_list: old.fees_list.filter((e) => e.id !== id),
      fees_number: old.fees_number - 1,
    })),

  // update category
  update_fee: (id, fee) =>
    set((old) => ({
      fees_list: old.fees_list.map((e) => (e.id == id ? fee : e)),
    })),

  // remove many categories
  remove_many_fees: (ids) =>
    set((old) => ({
      fees_list: old.fees_list.filter((e) => !ids.includes(e.id)),
      fees_number: old.fees_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      fees_number: num,
    })),
}));

export default useFeesStore;
