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
import { CreateCRMContactValidationSchemaType } from "./create-contact-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Switch } from "@/components/ui/switch";
import { generateRandomPassword } from "@/lib/utils";
import { HiOutlineHashtag } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RoleInterface from "@/interfaces/role.interface";

// Create crm contact access info section

interface Props {
  id?: string;
  roles: RoleInterface[];
}

const CreateCRMContact_AccessInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ roles, id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    setValue,
    control,
  } = useFormContext<CreateCRMContactValidationSchemaType>();

  // access controller
  const access_controller = useController({
    name: "access",
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
            disabled={disabled}
            checked={access_controller.field.value}
            onCheckedChange={(e) => access_controller.field.onChange(e)}
          />
        </div>
        {/* account info */}
        {access_controller.field.value ? (
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

export default CreateCRMContact_AccessInformation_Section;
