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
import { UpdateCRMContactValidationSchemaType } from "./update-contact-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Switch } from "@/components/ui/switch";
import { cn, generateRandomPassword } from "@/lib/utils";
import {
  HiExclamationCircle,
  HiOutlineHashtag,
  HiOutlinePencil,
  HiUser,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoleInterface from "@/interfaces/role.interface";
import CRMContactInterface from "@/interfaces/crm-contact.interface";
import { Link } from "@/i18n/routing";

// Update crm contact access info section

interface Props {
  id?: string;
  roles: RoleInterface[];
  accessData: CRMContactInterface["access"] | null;
}

const UpdateCRMContact_AccessInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id, roles, accessData }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    setValue,
    control,
  } = useFormContext<UpdateCRMContactValidationSchemaType>();

  // access controller
  const access_controller = useController({
    name: "access",
    control,
  });

  // old_access controller
  const old_access_controller = useController({
    name: "old_access",
    control,
  });

  // role controller
  const roleController = useController({
    control,
    name: "accessInfo.role",
  });

  // handle random password
  const handleGenerateRandomPassword = useCallback(() => {
    setValue("accessInfo.password", generateRandomPassword(20));
  }, []);

  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Account & Dashboard Access
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The contacts's account and dashboard access section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* Company */}
        <div className="flex flex-col col-span-full gap-2">
          <Label htmlFor="dashboard-access">
            Has Account Accessing Dashboard{" "}
            <span className="text-primary">
              (After creation you will find the user account in the users page)
            </span>
          </Label>
          <Switch
            checked={access_controller.field.value}
            onCheckedChange={(e) => access_controller.field.onChange(e)}
          />
        </div>
        {/* account info */}
        {access_controller.field.value &&
        old_access_controller.field.value &&
        accessData ? (
          <div className="flex flex-col col-span-2 w-full gap-2">
            <div className="sm:w-1/2 md:w-1/3 p-3 flex flex-col gap-3 border bg-card rounded-lg">
              <div className="w-full flex items-center justify-between gap-2">
                {/* basic info */}
                <div className="flex gap-2">
                  {accessData.profileInfo.pic ? (
                    <img
                      src={accessData.profileInfo.pic}
                      alt={accessData.profileInfo.fullName}
                      className={cn(
                        "size-[2.5em] object-cover rounded-full border border-input",
                        accessData.profileInfo.gender == "male"
                          ? "bg-blue-500/30"
                          : "bg-pink-500/30"
                      )}
                    />
                  ) : (
                    <div
                      className={cn(
                        "size-[2.5em] flex justify-center items-center border-2 rounded-full",
                        accessData.profileInfo.gender == "male"
                          ? "border-blue-500 bg-blue-500/30 text-blue-500"
                          : "border-pink-500 bg-pink-500/30 text-pink-500"
                      )}
                    >
                      <HiUser className="size-4" />
                    </div>
                  )}
                  <div className="">
                    <h6 className="text-base leading-4 font-medium text-foreground">
                      {accessData.profileInfo.username}
                    </h6>
                    <p className="text-sm text-foreground/70">
                      {accessData.profileInfo.email}
                    </p>
                  </div>
                </div>
                {/* role */}
                <span
                  style={{
                    backgroundColor: `rgb(from ${accessData.access.role.color} r g b / 0.1)`,
                    borderColor: `rgb(from ${accessData.access.role.color} r g b / 0.5)`,
                    color: `rgb(from ${accessData.access.role.color} r g b / 1)`,
                  }}
                  className="w-max flex items-center px-3 py-0.5 gap-2 text-xs font-medium rounded-full border"
                >
                  {accessData.access.role.name}
                </span>
              </div>
              {/* edit & delete buttons */}
              <div className="w-full flex flex-col gap-2">
                {!accessData.access.isAdmin ? (
                  <Button
                    className="w-full gap-2 border"
                    size="sm"
                    asChild
                    variant="secondary"
                  >
                    <Link href={`/users/update/${accessData.id}`}>
                      <HiOutlinePencil className="size-4" />
                      Edit Account
                    </Link>
                  </Button>
                ) : null}
                <Button
                  className="w-full gap-2 border bg-red-500/10 text-red-700 hover:bg-red-500/20 border-red-500/30"
                  size="sm"
                  onClick={() => {
                    old_access_controller.field.onChange(false);
                  }}
                  variant="destructive"
                >
                  <VscDebugDisconnect className="size-4" />
                  Disconnect account
                </Button>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs">
              <HiExclamationCircle className="size-4 text-blue-500" />
              When disconnect account from this contact it will not be deleted.
            </span>
            <span className="flex items-center gap-1 text-xs">
              <HiExclamationCircle className="size-4 text-blue-500" />
              You can delete the account from the{" "}
              <Link href="/users" className="text-primary">
                users
              </Link>{" "}
              page
            </span>
          </div>
        ) : access_controller.field.value ? (
          <>
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="Username"
                type="text"
                disabled={disabled}
                placeholder="UserName"
                {...register("accessInfo.username", { required: true })}
              />
              {errors?.accessInfo?.username ? (
                <InlineAlert type="error">
                  {errors.accessInfo?.username.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* email */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                disabled={disabled}
                placeholder="Example mohamed@gmail.com"
                {...register("accessInfo.email", { required: true })}
              />
              {errors?.accessInfo?.email ? (
                <InlineAlert type="error">
                  {errors.accessInfo?.email.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* password */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative w-full max-h-max">
                <Input
                  id="password"
                  type="text"
                  disabled={disabled}
                  placeholder="Password"
                  {...register("accessInfo.password", { required: true })}
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
              {errors?.accessInfo?.password ? (
                <InlineAlert type="error">
                  {errors.accessInfo?.password.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* role */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="role">Role & Access</Label>
              <Select onValueChange={roleController.field.onChange}>
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

              {errors?.accessInfo?.role ? (
                <InlineAlert type="error">
                  {errors.accessInfo?.role.message}
                </InlineAlert>
              ) : null}
            </div>
          </>
        ) : null}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default UpdateCRMContact_AccessInformation_Section;
