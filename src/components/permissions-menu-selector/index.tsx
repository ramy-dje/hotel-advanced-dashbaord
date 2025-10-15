import { SystemPermissions } from "@/interfaces/permissions/permissions";
import { useCallback, useEffect, useMemo, useState } from "react";
import PermissionsMenuItem from "./components/menu-item";
import { modulesCRUD } from "./dashboard-modules";

// The Permissions Menu Selector

interface Props {
  onPermissionsChange: React.Dispatch<
    React.SetStateAction<SystemPermissions[]>
  >;
  permissions: SystemPermissions[];
}

export default function PermissionsMenuSelector({
  onPermissionsChange: setSelected_permissions,
  permissions: selected_permissions,
}: Props) {
  const all_dashboard_modules = useMemo(() => modulesCRUD, []);

  const setMany = useCallback(
    (pers: SystemPermissions[]) => {
      setSelected_permissions((prev) => {
        const newPerms = new Set([...prev]);
        pers.forEach((p) => {
          if (!newPerms.has(p)) {
            newPerms.add(p);
          }
        });
        return Array.from(newPerms);
      });
    },
    [setSelected_permissions]
  );

  const removeMany = useCallback(
    (pers: SystemPermissions[]) => {
      setSelected_permissions((prev) => prev.filter((p) => !pers.includes(p)));
    },
    [setSelected_permissions]
  );

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-3">
        {all_dashboard_modules.map((module) => (
          <PermissionsMenuItem
            key={module.id}
            module={module}
            selected_permissions={selected_permissions}
            setMany={setMany}
            removeMany={removeMany}
          />
        ))}
      </div>
    </div>
  );
}
