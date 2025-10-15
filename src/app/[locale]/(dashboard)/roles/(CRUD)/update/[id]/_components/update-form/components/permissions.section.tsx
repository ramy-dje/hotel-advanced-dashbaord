"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { UpdateRoleValidationSchemaType } from "../update-role-validation.schema";
import PermissionsMenuSelector from "@/components/permissions-menu-selector";
import { SystemPermissions } from "@/interfaces/permissions/permissions";

// Update Role permissions Section

interface Props {
  id: string;
}

const UpdateRolePermissions_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const { control } = useFormContext<UpdateRoleValidationSchemaType>();

    // old permissions
    const old_permissions = useWatch({
      control,
      name: "old_permissions",
    });

    // permissions controller
    const permissions_controller = useController({
      control,
      name: "permissions",
    });

    // permissions
    const [permissions, setPermissions] = useState<SystemPermissions[]>(
      permissions_controller.field.value as SystemPermissions[]
    );

    // update hte permissions controller when the permission is updated
    useEffect(() => {
      permissions_controller.field.onChange(permissions);
    }, [permissions]);

    // setting the old permissions
    useEffect(() => {
      setPermissions(old_permissions as SystemPermissions[]);
    }, [old_permissions]);

    return (
      <CreationFormSection ref={ref} id={id} className="flex flex-col">
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Permissions & Access
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The Roles Permissions And Access
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent className="">
          {/* read time */}
          <div className="w-full col-span-full">
            <PermissionsMenuSelector
              onPermissionsChange={setPermissions}
              permissions={permissions}
            />
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateRolePermissions_Section;
