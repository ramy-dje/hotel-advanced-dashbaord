"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateRoleValidationSchemaType } from "../create-role-validation.schema";
import PermissionsMenuSelector from "@/components/permissions-menu-selector";
import { SystemPermissions } from "@/interfaces/permissions/permissions";

// Create Role permissions Section

interface Props {
  id: string;
}

const CreateRolePermissions_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const { control } = useFormContext<CreateRoleValidationSchemaType>();

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
        <CreationFormSectionContent>
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

export default CreateRolePermissions_Section;
