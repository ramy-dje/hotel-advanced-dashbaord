"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef, useCallback } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateUserValidationSchemaType } from "./update-user-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoleInterface from "@/interfaces/role.interface";
import { Button } from "@/components/ui/button";
import { cn, generateRandomPassword } from "@/lib/utils";
import { HiOutlineHashtag, HiOutlineTrash } from "react-icons/hi";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";

const maxFileSize = 1024 * 1024 * 2; // 2MB

// Update user account info section

interface Props {
  id: string;
  roles: RoleInterface[];
}

const UpdateUser_AccountInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, roles }, ref) => {
    const {
      formState: { errors, disabled },
      register,
      setValue,
      control,
    } = useFormContext<UpdateUserValidationSchemaType>();

    // role controller
    const roleController = useController({
      control,
      name: "role",
    });

    // image controller
    const image_controller = useController({
      control,
      defaultValue: null,
      name: "picture_file",
    });

    // old image url
    const old_image_url_controller = useController({
      control,
      name: "picture_old_url",
    });

    // image url controller
    const image_url_controller = useController({
      control,
      name: "picture_url",
    });

    // handle random password
    const handleGenerateRandomPassword = useCallback(() => {
      setValue("password", generateRandomPassword(20));
    }, []);

    // reset old image
    const resetOldImage = () => {
      // clear the object url
      if (image_url_controller.field.value) {
        URL.revokeObjectURL(image_url_controller.field.value);
      }
      // set the old
      image_controller.field.onChange(old_image_url_controller.field.value);
    };

    // logic
    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Account Information
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The user's Account information section
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* username */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="Username"
              type="text"
              disabled={disabled}
              placeholder="UserName"
              {...register("username", { required: true })}
            />
            {errors?.username ? (
              <InlineAlert type="error">{errors.username.message}</InlineAlert>
            ) : null}
          </div>
          {/* email */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="email">Email (Read Only)</Label>
            <Input
              id="email"
              type="text"
              readOnly
              disabled={disabled}
              {...register("email", { required: true })}
            />
          </div>
          {/* password */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="password">Password (Optional)</Label>
            <div className="relative w-full max-h-max">
              <Input
                id="password"
                type="text"
                disabled={disabled}
                placeholder="New Password"
                {...register("password", { required: true })}
              />
              {/* generate a password */}
              <Button
                variant="outline"
                className="h-8 p-1 absolute right-1 top-1"
                size="icon"
                type="button"
                title="Generate a radom password"
                onClick={handleGenerateRandomPassword}
              >
                <HiOutlineHashtag className="size-4" />
              </Button>
            </div>
            {errors?.password ? (
              <InlineAlert type="error">{errors.password.message}</InlineAlert>
            ) : null}
          </div>
          {/* role */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="role">Role & Access</Label>
            <Select
              value={roleController.field.value}
              onValueChange={(e) => e && roleController.field.onChange(e)}
            >
              <SelectTrigger disabled={disabled} id="role" className="w-auto">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem
                    style={{
                      borderColor: `${role.color}`,
                    }}
                    className="border-l-[3px] rounded-l-none "
                    value={role.id}
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors?.role ? (
              <InlineAlert type="error">{errors.role.message}</InlineAlert>
            ) : null}
          </div>
          {/* picture */}
          <div className="col-span-2">
            <Label className="block mb-2">Profile Picture</Label>
            <div className="relative flex items-center justify-center w-full border-border border rounded-md">
              <DropZone
                disabled={disabled}
                placeholder="Drop or select image"
                setFiles={(f) => {
                  // clear the old object url if existed
                  if (image_url_controller.field.value) {
                    URL.revokeObjectURL(image_url_controller.field.value);
                  }
                  // set the url
                  const url = URL.createObjectURL(f[0]);
                  image_url_controller.field.onChange(url);
                  // set the file
                  image_controller.field.onChange(f[0]);
                }}
                className={cn(
                  "border-0 w-full z-10",
                  typeof image_controller.field.value !== "string" &&
                    image_controller.field.value !== null &&
                    "w-1/2 justify-start"
                )}
                maxSize={maxFileSize}
                maxFiles={1}
                multiple={false}
                accept={{
                  "image/png": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "image/webp": [],
                }}
              />
              {typeof image_controller.field.value !== "string" &&
              image_controller.field.value !== null ? (
                <div className="px-6 flex items-center gap-3">
                  <Button
                    onClick={resetOldImage}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="gap-1"
                  >
                    <HiOutlineTrash className="size-4" />
                    Clear & reset image
                  </Button>
                </div>
              ) : null}
              <span className="absolute z-[9] select-none bottom-1 right-2 text-xs text-accent-foreground">
                Max Image Size 2MB
              </span>
            </div>
            <div className="w-full mb-2">
              {image_controller.field.value ? (
                <UploadedImageItem
                  key={"img"}
                  alt={"user picture"}
                  className="mt-3"
                  url={
                    typeof image_controller.field.value == "string"
                      ? image_controller.field.value
                      : (image_url_controller.field.value as string)
                  }
                  onRemove={() => {
                    if (typeof image_controller.field.value !== "string") {
                      // clear the object url
                      URL.revokeObjectURL(
                        image_url_controller.field.value as string
                      );
                    }
                    // clear the file
                    image_controller.field.onChange(undefined);
                  }}
                  meta={
                    typeof image_controller.field.value !== "string"
                      ? {
                          name: image_controller.field.value.name,
                          size: image_controller.field.value.size,
                        }
                      : undefined
                  }
                />
              ) : null}
            </div>
            {errors?.picture_file ? (
              <InlineAlert type="error">
                {errors.picture_file.message as string}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateUser_AccountInformation_Section;
