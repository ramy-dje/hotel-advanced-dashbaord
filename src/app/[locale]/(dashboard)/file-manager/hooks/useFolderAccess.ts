import { useState } from "react";

export function useFolderAccess() {
  const [folderPasswords, setFolderPasswords] = useState<
    Record<string, string>
  >({});
  const [passwordDialog, setPasswordDialog] = useState<{
    isOpen: boolean;
    folderId?: string;
    isRetry: boolean;
    onSuccess?: (folderId: string) => void;
  }>({ isOpen: false, isRetry: false });

  // Check if we have access to a folder
  const checkFolderAccess = (
    folderId: string,
    accessibility: string,
    onSuccess: (folderId: string) => void
  ) => {
    if (accessibility === "protected" && !folderPasswords[folderId]) {
      // Need password
      setPasswordDialog({
        isOpen: true,
        folderId,
        isRetry: false,
        onSuccess,
      });
      return false;
    }
    return true;
  };

  // Handle password submission
  const handlePasswordSubmit = (password: string) => {
    const folderId = passwordDialog.folderId;
    if (!folderId) return;

    // Store the password
    setFolderPasswords((prev) => ({
      ...prev,
      [folderId]: password,
    }));
  };

  // Open dialog for wrong password
  const handleWrongPassword = (folderId: string) => {
    setPasswordDialog({
      isOpen: true,
      folderId,
      isRetry: true,
    });
  };

  // Reset password for a folder
  const resetFolderPassword = (folderId: string) => {
    setFolderPasswords((prev) => {
      const newPasswords = { ...prev };
      delete newPasswords[folderId];
      return newPasswords;
    });
  };

  return {
    folderPasswords,
    passwordDialog,
    closePasswordDialog: () =>
      setPasswordDialog((prev) => ({ ...prev, isOpen: false })),
    checkFolderAccess,
    handlePasswordSubmit,
    handleWrongPassword,
    resetFolderPassword,
  };
}
