import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import { create } from "zustand";

// The Room Feature Page store (with zustand)

interface StoreType {
  features_list: RoomFeatureInterface[];
  features_number: number;

  // actions
  set_many: (features: RoomFeatureInterface[]) => void;
  add_feature: (feature: RoomFeatureInterface) => void;
  remove_feature: (id: string) => void;
  remove_many_features: (ids: string[]) => void;
  update_feature: (id: string, feature: RoomFeatureInterface) => void;

  set_total: (num: number) => void;
}

const useRoomFeaturesStore = create<StoreType>((set) => ({
  features_list: [],
  features_number: 0,

  // set many
  set_many: (features) =>
    set(() => ({
      features_list: features,
    })),

  // actions
  add_feature: (feature) =>
    set((old) => ({
      features_list: [feature, ...old.features_list],
      features_number: old.features_number + 1,
    })),

  // remove feature
  remove_feature: (id) =>
    set((old) => ({
      features_list: old.features_list.filter((e) => e.id !== id),
      features_number: old.features_number - 1,
    })),

  // remove many features
  remove_many_features: (ids) =>
    set((old) => ({
      features_list: old.features_list.filter((e) => !ids.includes(e.id)),
      features_number: old.features_number - ids.length,
    })),

  // update feature
  update_feature: (id, feature) =>
    set((old) => ({
      features_list: old.features_list.map((e) => (e.id == id ? feature : e)),
    })),

  // set the total
  set_total: (num) =>
    set(() => ({
      features_number: num,
    })),
}));

export default useRoomFeaturesStore;
