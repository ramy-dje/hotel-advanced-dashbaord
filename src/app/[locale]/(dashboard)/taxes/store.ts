import { create } from "zustand";
import { TaxInterface } from "@/interfaces/taxes.interface";

// The Taxes Page store (with zustand)

interface StoreType {
  taxes_list: TaxInterface[];
  taxes_number: number;

  // actions
  set_many: (taxes: TaxInterface[]) => void;
  add_tax: (tax: TaxInterface) => void;
  remove_tax: (id: string) => void;
  remove_many_taxes: (ids: string[]) => void;
  update_tax: (id: string, tax: TaxInterface) => void;

  set_total: (num: number) => void;
}

const useTaxesStore = create<StoreType>((set) => ({
  taxes_list: [],
  taxes_number: 0,

  // set many
  set_many: (taxes) =>
    set(() => ({
      taxes_list: taxes,
    })),

  // actions
  add_tax: (tax) =>
    set((old) => ({
      taxes_list: [...old.taxes_list, tax],
      taxes_number: old.taxes_number + 1,
    })),

  // remove category
  remove_tax: (id) =>
    set((old) => ({
      taxes_list: old.taxes_list.filter((e) => e.id !== id),
      taxes_number: old.taxes_number - 1,
    })),

  // update category
  update_tax: (id, tax) =>
    set((old) => ({
      taxes_list: old.taxes_list.map((e) => (e.id == id ? tax : e)),
    })),

  // remove many categories
  remove_many_taxes: (ids) =>
    set((old) => ({
      taxes_list: old.taxes_list.filter((e) => !ids.includes(e.id)),
      taxes_number: old.taxes_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      taxes_number: num,
    })),
}));

export default useTaxesStore;
