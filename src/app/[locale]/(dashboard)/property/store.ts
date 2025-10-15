import propertyInterface from "@/interfaces/property.interface";
import { create } from "zustand";
import PropertyDirectoryInterface from "@/interfaces/property-directory.interface";
import PropertyTypeInterface from "@/interfaces/property-type.interface";
// The propertys Page store (with zustand)

interface StoreType {
  properties_list: propertyInterface[];
  properties_number: number;

  // actions
  set_many: (properties: propertyInterface[]) => void;
  add_property: (property: propertyInterface) => void;
  remove_property: (id: string) => void;
  remove_many_propertys: (id: string[]) => void;
  update_property: (id: string, property: propertyInterface) => void;

  set_total: (num: number) => void;
}

interface PropertyDirectoriesStore {
  directories: PropertyDirectoryInterface[];
  add_directory: (directory: PropertyDirectoryInterface) => void;
  set_directories: (dirs: PropertyDirectoryInterface[]) => void;
}

interface PropertyTypesStore {
  types: PropertyTypeInterface[];
  add_type: (type: PropertyTypeInterface) => void;
  set_types: (types: PropertyTypeInterface[]) => void;
}

export const usePropertyDirectoriesStore = create<PropertyDirectoriesStore>((set) => ({
  directories: [],
  add_directory: (directory) =>
    set((state) => ({ directories: [directory, ...state.directories] })),
  set_directories: (dirs) => set({ directories: dirs }),
}));

export const usePropertyTypesStore = create<PropertyTypesStore>((set) => ({
  types: [],
  add_type: (type) =>
    set((state) => ({ types: [type, ...state.types] })),
  set_types: (types) => set({ types }),
}));

const usePropertiesStore = create<StoreType>((set) => ({
  properties_list: [],
  properties_number: 0,

  // set many
  set_many: (properties) =>
    set(() => ({
      properties_list: properties,
    })),

  // actions
  add_property: (property) =>
    set((old) => ({
      properties_list: [property,...old.properties_list],
      properties_number: old.properties_number + 1,
    })),

  // remove property
  remove_property: (id) =>
    set((old) => ({
      properties_list: old.properties_list.filter((e) => e.id !== id),
      properties_number: old.properties_number - 1,
    })),

  // remove many properties
  remove_many_propertys: (ids) =>
    set((old) => ({
      properties_list: old.properties_list.filter((e) => !ids.includes(e.id)),
      properties_number: old.properties_number - ids.length,
    })),

  // update property
  update_property: (id, property) =>
    set((old) => ({
      properties_list: old.properties_list.map((e) => (e.id == id ? property : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      properties_number: num,
    })),
}));

export default usePropertiesStore;
