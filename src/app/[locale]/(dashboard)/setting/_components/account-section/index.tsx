import {
  CreationFormContent,
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HiOutlineHashtag, HiOutlineTrash } from "react-icons/hi";
import { SettingUserValidationSchemaType } from "../setting-form/setting-validation.schema";
import { useController, useFormContext } from "react-hook-form";
import { useCallback } from "react";
import { cn, generateRandomPassword } from "@/lib/utils";
import UploadedImageItem from "@/components/uploaded-image";
import DropZone from "@/components/upload-files/drop-zone";

const maxFileSize = 1024 * 1024 * 2; // 2MB

// The Account Setting Account Section Form

interface Props {}

function SettingAccountSection({}: Props) {
  // form context
  const {
    formState: { errors, disabled },
    register,
    setValue,
    control,
  } = useFormContext<SettingUserValidationSchemaType>();

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

  return (
    <div className="w-full">
      {/* form */}
      <CreationFormContent className="min-h-screen flex flex-col gap-6">
        {/* main account info form  */}
        <CreationFormSection
          className="max-h-max"
          id={"account-information-section"}
        >
          <CreationFormSectionInfo className="max-h-max">
            <CreationFormSectionInfoTitle>
              Account & Personal Information
            </CreationFormSectionInfoTitle>
            <CreationFormSectionInfoDescription>
              The account & Personal information section
            </CreationFormSectionInfoDescription>
          </CreationFormSectionInfo>
          <CreationFormSectionContent className="w-full">
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
                <InlineAlert type="error">
                  {errors.username.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* fullname */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="fullname">Fullname</Label>
              <Input
                id="Fullname"
                type="text"
                disabled={disabled}
                placeholder="Fullname"
                {...register("fullname", { required: true })}
              />
              {errors?.fullname ? (
                <InlineAlert type="error">
                  {errors.fullname.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* email */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="email">Email (Read only)</Label>
              <Input
                id="email"
                type="text"
                disabled={disabled}
                readOnly
                placeholder="email"
                {...register("email", { required: true })}
              />
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
        {/* password info form  */}
        <CreationFormSection className="max-h-max" id={"password-section"}>
          <CreationFormSectionInfo className="max-h-max">
            <CreationFormSectionInfoTitle>
              Password
            </CreationFormSectionInfoTitle>
            <CreationFormSectionInfoDescription>
              The user's new password section
            </CreationFormSectionInfoDescription>
          </CreationFormSectionInfo>
          <CreationFormSectionContent className="w-full">
            {/* password */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative w-full max-h-max">
                <Input
                  id="password"
                  type="text"
                  disabled={disabled}
                  placeholder="Password"
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
                <InlineAlert type="error">
                  {errors.password.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* password confirm */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="password-confirm">Confirm New Password</Label>
              <div className="relative w-full max-h-max">
                <Input
                  id="password-confirm"
                  type="password"
                  disabled={disabled}
                  placeholder="Confirm Password"
                  {...register("passwordConfirm", { required: true })}
                />
              </div>
              {errors?.passwordConfirm ? (
                <InlineAlert type="error">
                  {errors.passwordConfirm.message}
                </InlineAlert>
              ) : null}
            </div>
          </CreationFormSectionContent>
        </CreationFormSection>
      </CreationFormContent>
    </div>
  );
}

export default SettingAccountSection;
