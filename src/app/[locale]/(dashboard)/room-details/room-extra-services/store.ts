import CRMContactInterface from "@/interfaces/crm-contact.interface";
import RoomExtraServicesInterface from "@/interfaces/room-extra-services";
import ServiceCategoryInterface from "@/interfaces/services-category.interface";
import { TaxInterface } from "@/interfaces/taxes.interface";
import { create } from "zustand";

// The Room Extra Services Page store (with zustand)

interface StoreType {
  extra_services_list: RoomExtraServicesInterface[];
  extra_services_number: number;
  existingTaxes: TaxInterface[];
  existingCategories: ServiceCategoryInterface[];
  existingEmployees: CRMContactInterface[];

  // actions
  set_many: (extraServices: RoomExtraServicesInterface[]) => void;
  add_extra_service: (extraService: RoomExtraServicesInterface) => void;
  remove_extra_service: (id: string) => void;
  remove_many_extra_services: (ids: string[]) => void;
  update_extra_service: (
    id: string,
    extraService: RoomExtraServicesInterface
  ) => void;

  set_total: (num: number) => void;
  set_existing_taxes: (taxes: TaxInterface[]) => void;
  set_existing_categories: (categories: ServiceCategoryInterface[]) => void;
  set_existing_employees: (employees: CRMContactInterface[]) => void;
}

const useRoomExtraServicesStore = create<StoreType>((set) => ({
  extra_services_list: [],
  extra_services_number: 0,
  existingTaxes: [],
  existingCategories: [],
  existingEmployees: [],

  // set many
  set_many: (extraServices) =>
    set(() => ({
      extra_services_list: extraServices,
    })),

  // actions
  add_extra_service: (extraService) =>
    set((old) => ({
      extra_services_list: [extraService, ...old.extra_services_list],
      extra_services_number: old.extra_services_number + 1,
    })),

  // remove extra service
  remove_extra_service: (id) =>
    set((old) => ({
      extra_services_list: old.extra_services_list.filter((e) => e.id !== id),
      extra_services_number: old.extra_services_number - 1,
    })),

  // remove many extra services
  remove_many_extra_services: (ids) =>
    set((old) => ({
      extra_services_list: old.extra_services_list.filter(
        (e) => !ids.includes(e.id)
      ),
      extra_services_number: old.extra_services_number - ids.length,
    })),

  // update extra service
  update_extra_service: (id, extraService) =>
    set((old) => ({
      extra_services_list: old.extra_services_list.map((e) =>
        e.id == id ? extraService : e
      ),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      extra_services_number: num,
    })),

  // set existing taxes
  set_existing_taxes: (taxes: TaxInterface[]) =>
    set(() => ({
      existingTaxes: taxes,
    })),

  // set existing categories
  set_existing_categories: (categories: ServiceCategoryInterface[]) =>
    set(() => ({
      existingCategories: categories,
    })),

  // set existing employees
  set_existing_employees: (employees: CRMContactInterface[]) =>
    set(() => ({
      existingEmployees: employees,
    })),
}));

export default useRoomExtraServicesStore;
