import { Switch } from "@/components/ui/switch";

import { SystemPermissions } from "@/interfaces/permissions/permissions";
import { memo, useCallback, useMemo } from "react";
import { modulesCRUDType } from "../dashboard-modules";

// The Crud Switcher
const CrudSwitch = memo(
  ({
    crud,
    selected_permissions,
    setMany,
    removeMany,
  }: {
    crud: modulesCRUDType[0]["cruds"][0];
    selected_permissions: SystemPermissions[];
    setMany: (pers: SystemPermissions[]) => void;
    removeMany: (pers: SystemPermissions[]) => void;
  }) => {
    const isChecked = useMemo(
      () =>
        [...crud.permission, ...crud.dependency].every((p) =>
          selected_permissions.includes(p)
        ),
      [selected_permissions, crud.permission, crud.dependency]
    );

    const handleChange = useCallback(
      (checked: boolean) => {
        if (checked) {
          setMany([...crud.permission, ...crud.dependency]);
        } else {
          removeMany(crud.permission);
        }
      },
      [crud.permission, crud.dependency, setMany, removeMany]
    );

    return (
      <div className="w-[6em] flex flex-col items-center gap-2">
        <div
          className={`flex gap-1 items-center text-center ${
            crud.color === "red"
              ? "text-red-500"
              : crud.color === "green"
              ? "text-green-500"
              : crud.color === "blue"
              ? "text-blue-500"
              : crud.color === "yellow"
              ? "text-yellow-500"
              : crud.color === "purple"
              ? "text-purple-500"
              : crud.color === "gray"
              ? "text-gray-500"
              : crud.color === "cyan"
              ? "text-cyan-600"
              : crud.color === "dark-red"
              ? "text-red-800"
              : "text-green-500"
          }`}
        >
          <crud.Icon className="size-4" />
          <span className="text-xs font-semibold">{crud.name}</span>
        </div>
        <Switch
          size="sm"
          checked={isChecked}
          onCheckedChange={handleChange}
          className={`${
            crud.color === "red"
              ? "data-[state=checked]:bg-red-500"
              : crud.color === "green"
              ? "data-[state=checked]:bg-green-500"
              : crud.color === "blue"
              ? "data-[state=checked]:bg-blue-500"
              : crud.color === "yellow"
              ? "data-[state=checked]:bg-yellow-500"
              : crud.color === "purple"
              ? "data-[state=checked]:bg-purple-500"
              : crud.color === "gray"
              ? "data-[state=checked]:bg-gray-500"
              : crud.color === "cyan"
              ? "data-[state=checked]:bg-cyan-600"
              : crud.color === "dark-red"
              ? "data-[state=checked]:bg-red-800"
              : "data-[state=checked]:bg-green-500"
          }`}
        />
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.crud.name === next.crud.name &&
      prev.selected_permissions.length === next.selected_permissions.length
    );
  }
);

// The permission module item

interface Props {
  module: modulesCRUDType[0];
  selected_permissions: SystemPermissions[];
  // methods
  setMany: (pers: SystemPermissions[]) => void;
  removeMany: (pers: SystemPermissions[]) => void;
}

const PermissionsMenuItem = memo(
  ({ module, selected_permissions, setMany, removeMany }: Props) => {
    // is this module checked
    const isModuleChecked = useMemo(
      () => module.allPermission.every((p) => selected_permissions.includes(p)),
      [selected_permissions, module.allPermission]
    );

    const handleModuleChange = useCallback(
      (checked: boolean) => {
        if (checked) {
          setMany(module.allPermission);
        } else {
          removeMany(module.allPermission);
        }
      },
      [module.allPermission, setMany, removeMany]
    );

    return (
      <div className="w-full flex items-center justify-between px-5 py-3 rounded-lg bg-muted/40 border hover:shadow-sm">
        <div className="flex items-center gap-2">
          <Switch
            checked={isModuleChecked}
            onCheckedChange={handleModuleChange}
            size="sm"
            className="mr-2"
          />
          <module.Icon className="size-5 text-primary" />
          <h3 className="text-sm font-medium text-foreground">
            {module.title}
          </h3>
        </div>

        <div className="max-w-[80%] lg:max-w-[60%] xl:max-w-[50%] justify-end flex gap-2 items-center flex-wrap">
          {module.cruds.map((crud) => (
            <CrudSwitch
              key={crud.name}
              crud={crud}
              selected_permissions={selected_permissions}
              setMany={setMany}
              removeMany={removeMany}
            />
          ))}
        </div>
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.module.id === next.module.id &&
      prev.selected_permissions.length === next.selected_permissions.length
    );
  }
);

export default PermissionsMenuItem;
