import { RatePlanInterface } from "@/interfaces/rate.interface";
import { create } from "zustand";
import { Client_OfferInterface, OfferInterface } from "@/interfaces/offers.interface";

// The Rate Categories Page store (with zustand)

interface StoreType {
  offers_list: Client_OfferInterface[];
  offers_number: number;

  // actions
  set_many: (offers: Client_OfferInterface[]) => void;
  add_offer: (offer: Client_OfferInterface) => void;
  remove_offer: (id: string) => void;
  remove_many_offers: (ids: string[]) => void;
  update_offer: (id: string, offer: Client_OfferInterface) => void;

  set_total: (num: number) => void;
}

const useOfferStore = create<StoreType>((set) => ({
  offers_list: [],
  offers_number: 0,

  // set many
  set_many: (offers) =>
    set(() => ({
      offers_list: offers,
    })),

  // actions
  add_offer: (offer) =>
    set((old) => ({
      offers_list: [...old.offers_list, offer],
      offers_number: old.offers_number + 1,
    })),

  // remove offer
  remove_offer: (id) =>
    set((old) => ({
      offers_list: old.offers_list.filter((e) => e.id !== id),
      offers_number: old.offers_number - 1,
    })),

  // update offer
  update_offer: (id, offer) =>
    set((old) => ({
      offers_list: old.offers_list.map((e) => (e.id == id ? offer : e)),
    })),

  // remove many offers
  remove_many_offers: (ids) =>
    set((old) => ({
      offers_list: old.offers_list.filter((e) => !ids.includes(e.id)),
      offers_number: old.offers_number - ids.length,
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      offers_number: num,
    })),
}));

export default useOfferStore;
