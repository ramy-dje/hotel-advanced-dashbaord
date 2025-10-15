import { FileType } from "@/components/file-upload/file-preview";
import RoleInterface from "./role.interface";

export interface FileInterface {
  id: string;
  originalname: string;
  mimetype: string;
  size: number;
  type: FileType;
  owner?: string;
  entityType?: string;
  updatedAt: string;
  isLocked?: boolean;
  folderId?: string;
  createdAt: string;
  deletedBy?: string | null;
  deletedAt?: string | null;
  isDeleted?: boolean;
  sharedWith: SharedWith[];
  sharedWithRoles?: SharedWithRoles[];
  presignedUrl: string;
  alt?: string;
}
export interface SharedWith {
  id: string;
  fullName: string;
  permission: "admin" | "read" | "write";
  pic: string;
  sharedAt: string;
}
export interface SharedWithRoles {
  roleId: string;
  roleName: string;
  permission: "admin" | "read" | "write";
  sharedAt: string;
  role?: { id: string; color: string; name: string };
}
export interface FolderInterface {
  id: string;
  name: string;
  note?: string;
  updatedAt: string;
  createdAt: string;
  filesCount: number;
  totalSize: number;
  entityType: string;
  parentId: string | null;
  ancestors: string[];
  accessibility: "protected" | "public";
  owner: string;
  deletedBy: string | null;
  deletedAt: string | null;
  isDeleted: boolean;
  sharedWith: SharedWith[];
  sharedWithRoles?: SharedWithRoles[];
}

export interface FolderBrowseResponse {
  folders: FolderInterface[];
  files: FileInterface[];
  pagination: {
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface UsersSlimResponse {
  data: {
    id: string;
    profileInfo: {
      pic: string;
      username: string;
      email: string;
      fullName: string;
    };
  }[];
  page: number;
  total: number;
  size: number;
}
export interface RolesResponse {
  data: RoleInterface[];
  page: number;
  total: number;
  size: number;
}

export interface StorageSizeByType {
  image: number;
  document: number;
  pdf: number;
  video: number;
  audio: number;
  archive: number;
  other: number;
}

export interface StorageData {
  totalStorageUsed: number;
  storageSizeByType: StorageSizeByType;
}

export interface BreadcrumbData {
  id: string;
  name: string;
}

export interface FileDetails {
  id: string;
  originalname: string;
  presignedUrl: string;
  type: FileType;
  size: number;
}
