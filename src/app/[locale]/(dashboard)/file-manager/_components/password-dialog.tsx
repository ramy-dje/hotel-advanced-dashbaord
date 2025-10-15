import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCheckFolderPassword } from "../api-hooks";
import { toast } from "@/hooks/use-toast";
import useFileManagerStore from "../store";

// Send password zod validation schema

const passwordValidationSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
  })
  .strict();

type PasswordValidationSchemaType = z.infer<typeof passwordValidationSchema>;
type PasswordDialogProps = {
  isOpen: boolean;
  folderId?: string;
  type?: "requiredPassword" | "wrongPassword";
  onSuccess?: (folderId: string) => void;
  onClose: () => void;
  handleSavePassword: (password: string) => void;
};
const defaultValues: PasswordValidationSchemaType = {
  password: "",
};
export function PasswordDialog({
  folderId,
  isOpen,
  onClose,
  type = "requiredPassword",
  onSuccess,
  handleSavePassword,
}: PasswordDialogProps) {
  const { current_folder_id } = useFileManagerStore();
  const checkPassword = useCheckFolderPassword();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<PasswordValidationSchemaType>({
    resolver: zodResolver(passwordValidationSchema),
    defaultValues,
  });
  useEffect(() => {
    if (isOpen) form.reset(defaultValues);
  }, [isOpen, form]);
  if (!folderId) return null;
  const handleSubmit = async (values: PasswordValidationSchemaType) => {
    try {
      await checkPassword.mutateAsync({
        folderId,
        password: values.password,
      });
      handleSavePassword(values.password);
      onClose();
      setTimeout(() => {
        //  call success handler if provided
        if (onSuccess) {
          onSuccess(folderId);
        }
      }, 0);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "The password you entered is incorrect. Please try again.",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !open && current_folder_id !== folderId && onClose()
      }
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Lock className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">Folder Protected</DialogTitle>
          <DialogDescription className="text-center">{`Enter the password to access this folder`}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        autoFocus
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {type === "wrongPassword" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  The password you entered is incorrect. Please try again.
                </AlertDescription>
              </Alert>
            )}
            <DialogFooter className="mt-4">
              {current_folder_id !== folderId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={checkPassword.isPending}
                >
                  Close
                </Button>
              )}
              <Button
                type="submit"
                disabled={checkPassword.isPending}
                isLoading={checkPassword.isPending}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
