import CRMContactInterface from "@/interfaces/crm-contact.interface";
import { create } from "zustand";

// The CRM Contacts Page store (with zustand)

interface StoreType {
  contacts_list: CRMContactInterface[];
  contacts_number: number;

  // actions
  set_many: (contacts: CRMContactInterface[]) => void;
  add_contact: (contact: CRMContactInterface) => void;
  remove_contact: (id: string) => void;
  remove_many_contacts: (ids: string[]) => void;
  update_contact: (id: string, contact: CRMContactInterface) => void;

  set_total: (num: number) => void;
}

const useCRMContactsStore = create<StoreType>((set) => ({
  contacts_list: [],
  contacts_number: 0,

  // set many
  set_many: (contacts) =>
    set(() => ({
      contacts_list: contacts,
    })),

  // actions
  add_contact: (contact) =>
    set((old) => ({
      contacts_list: [contact, ...old.contacts_list],
      contacts_number: old.contacts_number + 1,
    })),

  // remove contact
  remove_contact: (id) =>
    set((old) => ({
      contacts_list: old.contacts_list.filter((e) => e.id !== id),
      contacts_number: old.contacts_number - 1,
    })),

  // remove many contacts
  remove_many_contacts: (ids) =>
    set((old) => ({
      contacts_list: old.contacts_list.filter((e) => !ids.includes(e.id)),
      contacts_number: old.contacts_number - ids.length,
    })),

  // update contact
  update_contact: (id, contact) =>
    set((old) => ({
      contacts_list: old.contacts_list.map((e) => (e.id == id ? contact : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      contacts_number: num,
    })),
}));

export default useCRMContactsStore;
