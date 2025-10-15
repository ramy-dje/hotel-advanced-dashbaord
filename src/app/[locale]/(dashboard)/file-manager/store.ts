import { FileInterface, FolderInterface } from "@/interfaces/file-manager";
import { create } from "zustand";

// The file manager Page store (with zustand)

interface StoreType {
  current_folder_id: string;
  selected_files: string[];
  selected_folders: string[];
  is_move_dialog_open: boolean;
  folder_dialog: {
    isOpen: boolean;
    folder?: FolderInterface;
    mode: "create" | "update";
  };

  // actions
  set_current_folder_id: (id: string) => void;
  set_is_move_dialog_open: (open: boolean) => void;
  set_selected_files: (files: string[]) => void;
  set_selected_folders: (folders: string[]) => void;
  handle_select_file: (fileId: string, isSelected: boolean) => void;
  handle_select_folder: (folderId: string, isSelected: boolean) => void;
  handle_select_all: (
    folders: FolderInterface[],
    files: FileInterface[],
    isSelected: boolean
  ) => void;
  set_folder_dialog: (
    dialog: { isOpen: boolean } & (
      | {
          folder?: undefined;
          mode: "create";
        }
      | {
          folder: FolderInterface;
          mode: "update";
        }
    )
  ) => void;
}

const useFileManagerStore = create<StoreType>((set) => ({
  current_folder_id: "",
  selected_files: [],
  selected_folders: [],
  is_move_dialog_open: false,
  folder_dialog: {
    isOpen: false,
    folder: undefined,
    mode: "create",
  },

  // actions
  set_current_folder_id: (folderId) =>
    set(() => ({
      current_folder_id: folderId,
    })),

  set_is_move_dialog_open: (open) =>
    set(() => ({
      is_move_dialog_open: open,
    })),

  set_selected_files: (files) =>
    set(() => ({
      selected_files: files,
    })),
  set_selected_folders: (folders) =>
    set(() => ({
      selected_folders: folders,
    })),
  handle_select_file: (fileId, isSelected) =>
    set(({ selected_files }) => ({
      selected_files: isSelected
        ? [...selected_files, fileId]
        : selected_files.filter((id) => id !== fileId),
    })),
  handle_select_folder: (folderId, isSelected) =>
    set(({ selected_folders }) => ({
      selected_folders: isSelected
        ? [...selected_folders, folderId]
        : selected_folders.filter((id) => id !== folderId),
    })),
  handle_select_all: (folders, files, isSelected) =>
    set(() =>
      isSelected
        ? {
            selected_files: files.map((file) => file.id),
            selected_folders: folders.map((folder) => folder.id),
          }
        : {
            selected_files: [],
            selected_folders: [],
          }
    ),
  set_folder_dialog: (dialog) =>
    set(({ folder_dialog }) => ({
      folder_dialog: {
        ...folder_dialog,
        ...dialog,
      },
    })),
}));

export default useFileManagerStore;
