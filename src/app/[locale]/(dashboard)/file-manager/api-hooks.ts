import axiosAPI from "@/lib/axios";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { LIMIT } from "@/components/select-images-dialog/file-icon";
import {
  BreadcrumbData,
  FileInterface,
  FolderBrowseResponse,
  RolesResponse,
  SharedWith,
  SharedWithRoles,
  StorageData,
  UsersSlimResponse,
} from "@/interfaces/file-manager";
import { AxiosError } from "axios";

const handleRetry = (failureCount: number, error: Error) => {
  // Do not retry for 403 errors
  if ((error as AxiosError).response?.status === 403) {
    return false;
  }
  // Retry up to 3 times for other errors
  return failureCount < 3;
};

// get files and folders
export function useFolderBrowse(
  size: number,
  filters:
    | {
        search?: string;
        folderId?: string;
        itemType?: string;
        fileType?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: string;
        sortOrder?: string;
        sharedWithMe?: boolean;
      }
    | undefined = {},
  folderPasswords: Record<string, string>,
  isLazy = false
) {
  const { folderId, ...restFilters } = filters;
  return useInfiniteQuery<FolderBrowseResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["folder-browse", { folderId, ...restFilters, size }],
    staleTime: 600000, //5 min
    queryFn: async ({ pageParam = 1 }) => {
      const headers: Record<string, string> = {};
      // Add password to headers if we have one for this folder
      if (folderId && folderPasswords[folderId]) {
        headers["X-Folder-Access-Password"] = folderPasswords[folderId];
      }
      const response = await axiosAPI.get(`v1/folders/browse`, {
        params: { ...restFilters, parentId: folderId, size, page: pageParam },
        timeout: 120000,
        headers,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch files");
      }
      return response.data!;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    retry: handleRetry,
    enabled: !isLazy,
  });
}

export function useGetCurrentLocation(folderId?: string | null) {
  return useQuery<BreadcrumbData[]>({
    queryKey: ["folder-browse-breadcrumb", folderId],
    staleTime: 600000, //5min
    queryFn: async () => {
      const response = await axiosAPI.get(
        `v1/folders/${folderId}/breadcrumbs`,
        {
          timeout: 120000,
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch folder breadcrumbs");
      }
      return response.data!;
    },
    retry: handleRetry,
    enabled: !!folderId,
  });
}

// ------ folders ---------
export function useGetFolders(
  currentFolderId: string,
  size: number,
  isLazy = false
) {
  return useInfiniteQuery({
    queryKey: ["folders", { folderId: currentFolderId, size }],
    staleTime: 600000, //5 min
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosAPI.get(
        `v1/folders?page=${pageParam}&size=${size}${
          currentFolderId ? `&parentId=${currentFolderId}` : ""
        }`,
        { timeout: 120000 }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch folders");
      }
      return response.data!;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
    retry: handleRetry,
    enabled: !isLazy,
  });
}

export function useCheckFolderPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      password,
    }: {
      folderId: string;
      password: string;
    }) => {
      const response = await axiosAPI.post(
        `v1/folders/${folderId}/check-password`,
        JSON.stringify({ password }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Wrong password");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.folderId ? { folderId: variables.folderId } : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

// Update the other mutation functions to use the new queryKeys
export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFolder: {
      name: string;
      accessibility: "public" | "protected";
      accessPassword?: string;
      parentId?: string;
      sharedWith?: {
        principalId: string;
        principalType: string;
        permission: "admin" | "read" | "write";
      }[];
      sharedWithRoles?: {
        roleId: string;
        permission: "admin" | "read" | "write";
      }[];
      note?: string;
    }) => {
      const response = await axiosAPI.post(
        "v1/folders",
        JSON.stringify(newFolder),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 201, !response.data)) {
        throw new Error("Failed to create folder");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.parentId ? { folderId: variables.parentId } : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentFolderId,
      ...rest
    }: {
      folderId: string;
      name: string;
      accessibility: "public" | "protected";
      accessPassword?: string;
      note?: string;
      currentFolderId?: string;
    }) => {
      const response = await axiosAPI.patch(
        `v1/folders/${folderId}`,
        JSON.stringify({ ...rest }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update folder");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderId,
    }: {
      folderId: string;
      currentFolderId: string;
    }) => {
      const response = await axiosAPI.delete(`v1/folders/${folderId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete folder");
      }

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

// share folder with roles
// get share folder with roles infos
export function useGetShareFolderWithRolesInfos(folderId?: string | null) {
  return useQuery<SharedWithRoles[]>({
    queryKey: ["folders", folderId, "share-with-roles"],
    queryFn: async () => {
      const response = await axiosAPI.get(
        `v1/folders/${folderId}/share-roles`,
        {
          timeout: 120000,
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch share information");
      }
      return response.data!;
    },
    enabled: !!folderId,
    retry: handleRetry,
  });
}
export function useShareWithRolesFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sharedWithRoles,
    }: {
      sharedWithRoles: {
        roleId: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    }) => {
      const response = await axiosAPI.post(
        `v1/folders/${id}/share-roles`,
        JSON.stringify(sharedWithRoles),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to share folder");
      }

      return response.data!;
    },

    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useUpdateShareWithRoleFolderPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      roleId,
      permission,
    }: {
      id: string;
      roleId: string;
      permission: "admin" | "read" | "write";
    }) => {
      const response = await axiosAPI.patch(
        `v1/folders/${id}/share-roles/${roleId}`,
        JSON.stringify({
          permission,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update permission");
      }

      return response.data!;
    },
    mutationKey: ["updateShareWithRoleFolderPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useDeleteShareWithRoleFolderPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) => {
      const response = await axiosAPI.delete(
        `v1/folders/${id}/share-roles/${roleId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete share permission");
      }

      return true;
    },
    mutationKey: ["deleteShareWithRoleFolderPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

// share folder
// get share folder infos
export function useGetShareFolderInfos(folderId?: string | null) {
  return useQuery<SharedWith[]>({
    queryKey: ["folders", folderId, "share"],
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/folders/${folderId}/share`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch share information");
      }
      return response.data!;
    },
    enabled: !!folderId,
    retry: handleRetry,
  });
}
export function useShareFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sharedWith,
    }: {
      sharedWith: {
        principalId: string;
        principalType: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    }) => {
      const response = await axiosAPI.post(
        `v1/folders/${id}/share`,
        JSON.stringify({
          sharedWith,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to share folder");
      }

      return response.data!;
    },

    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useUpdateShareFolderPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      principalId,
      permission,
    }: {
      id: string;
      principalId: string;
      permission: "admin" | "read" | "write";
    }) => {
      const response = await axiosAPI.patch(
        `v1/folders/${id}/share/${principalId}`,
        JSON.stringify({
          permission,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update permission");
      }

      return response.data!;
    },
    mutationKey: ["updateShareFolderPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useDeleteShareFolderPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      principalId,
    }: {
      id: string;
      principalId: string;
    }) => {
      const response = await axiosAPI.delete(
        `v1/folders/${id}/share/${principalId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete file");
      }

      return true;
    },
    mutationKey: ["deleteShareFolderPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the folders query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["folders", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

// ------ files ---------

export function useCreateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      parentId,
      files,
      sharedWith,
      sharedWithRoles,
      parentName,
    }: {
      parentId?: string;
      sharedWith?: {
        principalId: string;
        principalType: string;
        permission: "admin" | "read" | "write";
      }[];
      sharedWithRoles?: {
        roleId: string;
        permission: "admin" | "read" | "write";
      }[];
      files: File[];
      parentName?: string;
    }) => {
      const formData = new FormData();
      if (parentName) {
        // get parent id using name
        const response = await axiosAPI.get(`v1/folders/by-name`, {
          params: { name: parentName },
          timeout: 120000,
        });
        if ((response.status !== 200, !response.data)) {
          throw new Error("Failed to fetch parent folder ID");
        }
        formData.append("folderId", response.data.folderId);
      } else if (parentId) formData.append("folderId", parentId);

      files.forEach((file) => formData.append("files", file));
      if (sharedWith && sharedWith.length > 0)
        formData.append("sharedWith", JSON.stringify(sharedWith));
      if (sharedWithRoles && sharedWithRoles.length > 0)
        formData.append("sharedWithRoles", JSON.stringify(sharedWithRoles));

      const response = await axiosAPI.post(
        "v1/files/upload-multiple",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: Infinity,
        }
      );

      if ((response.status !== 201, !response.data)) {
        throw new Error("Failed to upload file");
      }

      return response.data! as FileInterface[];
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.parentId ? { folderId: variables.parentId } : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentFolderId,
      ...rest
    }: {
      fileId: string;
      originalname: string;
      currentFolderId: string;
      alt?: string;
    }) => {
      const response = await axiosAPI.patch(
        `v1/files/${fileId}`,
        JSON.stringify(rest),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update file");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
    }: {
      fileId: string;
      currentFolderId: string;
    }) => {
      const response = await axiosAPI.delete(`v1/files/${fileId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete file");
      }

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

// share file
// get share file infos
export function useGetShareFileInfos(fileId?: string | null) {
  return useQuery<SharedWith[]>({
    queryKey: ["files", fileId, "share"],
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/files/${fileId}/share`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch share info");
      }
      return response.data!;
    },
    enabled: !!fileId,
    retry: handleRetry,
  });
}

export function useShareFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sharedWith,
    }: {
      sharedWith: {
        principalId: string;
        principalType: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    }) => {
      const response = await axiosAPI.post(
        `v1/files/${id}/share`,
        JSON.stringify({
          sharedWith,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to share file");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useUpdateShareFilePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      principalId,
      permission,
    }: {
      id: string;
      principalId: string;
      permission: "admin" | "read" | "write";
    }) => {
      const response = await axiosAPI.patch(
        `v1/files/${id}/share/${principalId}`,
        JSON.stringify({
          permission,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update permission");
      }

      return response.data!;
    },
    mutationKey: ["updateShareFilePermission"],
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useDeleteShareFilePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      principalId,
    }: {
      id: string;
      principalId: string;
    }) => {
      const response = await axiosAPI.delete(
        `v1/files/${id}/share/${principalId}`,
        {
          timeout: 120000,
        }
      );

      if (response.status !== 204) {
        throw new Error("Failed to delete file");
      }

      return true;
    },
    mutationKey: ["deleteShareFilePermission"],
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

// share file with roles
// get share file infos
export function useGetShareFileWithRolesInfos(fileId?: string | null) {
  return useQuery<SharedWithRoles[]>({
    queryKey: ["files", fileId, "share-with-roles"],
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/files/${fileId}/share-roles`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch share info");
      }
      return response.data!;
    },
    enabled: !!fileId,
    retry: handleRetry,
  });
}

export function useShareFileWithRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      sharedWithRoles,
    }: {
      sharedWithRoles: {
        roleId: string;
        permission: "admin" | "read" | "write";
      }[];
      id: string;
    }) => {
      const response = await axiosAPI.post(
        `v1/files/${id}/share-roles`,
        JSON.stringify(sharedWithRoles),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to share file");
      }

      return response.data!;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useUpdateShareFileWithRolesPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      roleId,
      permission,
    }: {
      id: string;
      roleId: string;
      permission: "admin" | "read" | "write";
    }) => {
      const response = await axiosAPI.patch(
        `v1/files/${id}/share-roles/${roleId}`,
        JSON.stringify({
          permission,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            timeout: 120000,
          },
        }
      );

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to update permission");
      }

      return response.data!;
    },
    mutationKey: ["updateShareFileWithRolesPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useDeleteShareFileWithRolesPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, roleId }: { id: string; roleId: string }) => {
      const response = await axiosAPI.delete(`v1/files/${id}/share/${roleId}`, {
        timeout: 120000,
      });

      if (response.status !== 204) {
        throw new Error("Failed to delete file");
      }

      return true;
    },
    mutationKey: ["deleteShareFileWithRolesPermission"],
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: ["files", variables.id, "share-with-roles"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folder-browse"],
      });
    },
  });
}

export function useMoveToFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileIds,
      folderIds,
      targetFolderId,
    }: {
      fileIds: string[];
      folderIds: string[];
      targetFolderId: string;
      currentFolderId: string;
    }) => {
      let success = true;

      // move files
      for (const fileId of fileIds) {
        try {
          const response = await axiosAPI.patch(
            `v1/files/${fileId}`,
            JSON.stringify({
              folderId: targetFolderId,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 120000,
            }
          );

          if ((response.status !== 200, !response.data)) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          success = false;
        }
      }

      // move folders
      for (const folderId of folderIds) {
        try {
          const response = await axiosAPI.patch(
            `v1/folders/${folderId}`,
            JSON.stringify({
              parentId: targetFolderId,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
              timeout: 120000,
            }
          );

          if ((response.status !== 200, !response.data)) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to move some items");
      }

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileIds,
      folderIds,
    }: {
      fileIds: string[];
      folderIds: string[];
      currentFolderId: string;
    }) => {
      let success = true;

      // Delete files
      for (const fileId of fileIds) {
        try {
          const response = await axiosAPI.delete(`v1/files/${fileId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting file:", error);
          success = false;
        }
      }

      // Delete folders
      for (const folderId of folderIds) {
        try {
          const response = await axiosAPI.delete(`v1/folders/${folderId}`, {
            timeout: 120000,
          });

          if (response.status !== 204) {
            success = false;
          }
        } catch (error) {
          console.error("Error deleting folder:", error);
          success = false;
        }
      }

      if (!success) {
        throw new Error("Failed to delete some items");
      }

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidate the files query to refetch the data
      queryClient.invalidateQueries({
        queryKey: [
          "folder-browse",
          {
            ...(variables.currentFolderId
              ? { folderId: variables.currentFolderId }
              : {}),
            size: LIMIT,
          },
        ],
      });
    },
  });
}

// get users slim
export function useUsersSlim(size: number, name: string) {
  return useInfiniteQuery<UsersSlimResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["users-slim", { name, size }],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosAPI.get(`user/slim`, {
        params: { ...(name ? { name } : {}), size, page: pageParam },
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch users");
      }
      return response.data!;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      // check if you're not on the last page
      lastPage.page !== Math.ceil(lastPage.total / size) - 1
        ? lastPage.page + 1
        : undefined,
    retry: handleRetry,
  });
}

// get roles
export function useGetRoles(size: number, name: string) {
  return useInfiniteQuery<RolesResponse>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["roles", { name, size }],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await axiosAPI.get(`roles`, {
        params: { ...(name ? { name } : {}), size, page: pageParam },
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch roles");
      }
      return response.data!;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      // check if you're not on the last page
      lastPage.page !== Math.ceil(lastPage.total / size) - 1
        ? lastPage.page + 1
        : undefined,
    retry: handleRetry,
  });
}

export function useGetFileManagerKpis(isEnabled = false) {
  return useQuery<StorageData>({
    queryKey: ["file-manager-kpis"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    queryFn: async () => {
      const response = await axiosAPI.get(`v1/fm-analytics/storage`, {
        timeout: 120000,
      });

      if ((response.status !== 200, !response.data)) {
        throw new Error("Failed to fetch file manager kpis");
      }
      return response.data!;
    },
    retry: handleRetry,
    enabled: isEnabled,
  });
}
