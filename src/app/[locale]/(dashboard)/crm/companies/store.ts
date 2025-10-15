import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import { create } from "zustand";

// The CRM Companies Page store (with zustand)

interface StoreType {
  companies_list: CRMCompanyInterface[];
  companies_number: number;

  // actions
  set_many: (companies: CRMCompanyInterface[]) => void;
  add_company: (company: CRMCompanyInterface) => void;
  remove_company: (id: string) => void;
  remove_many_companies: (ids: string[]) => void;
  update_company: (id: string, company: CRMCompanyInterface) => void;

  set_total: (num: number) => void;
}

const useCRMCompaniesStore = create<StoreType>((set) => ({
  companies_list: [],
  companies_number: 0,

  // set many
  set_many: (companies) =>
    set(() => ({
      companies_list: companies,
    })),

  // actions
  add_company: (company) =>
    set((old) => ({
      companies_list: [company, ...old.companies_list],
      companies_number: old.companies_number + 1,
    })),

  // remove company
  remove_company: (id) =>
    set((old) => ({
      companies_list: old.companies_list.filter((e) => e.id !== id),
      companies_number: old.companies_number - 1,
    })),

  // remove many companies
  remove_many_companies: (ids) =>
    set((old) => ({
      companies_list: old.companies_list.filter((e) => !ids.includes(e.id)),
      companies_number: old.companies_number - ids.length,
    })),

  // update company
  update_company: (id, company) =>
    set((old) => ({
      companies_list: old.companies_list.map((e) => (e.id == id ? company : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      companies_number: num,
    })),
}));

export default useCRMCompaniesStore;
