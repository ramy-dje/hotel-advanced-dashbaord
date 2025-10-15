import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  CreationTabsContent,
  CreationTabsTab,
} from "@/components/creation-tabs";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import {
  CreateRoleValidationSchema,
  CreateRoleValidationSchemaType,
} from "./create-role-validation.schema";
import CreateRole_MainInformation_Section from "./components/main-info.section";
import CreateRolePermissions_Section from "./components/permissions.section";
import { crud_create_role } from "@/lib/curd/role";
import { SystemPermissions } from "@/interfaces/permissions/permissions";

interface Props {}

export default function CreateRoleFrom({}: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateRoleValidationSchemaType>({
    resolver: zodResolver(CreateRoleValidationSchema),
    defaultValues: {
      permissions: [],
      color: "",
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_permissions_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("name");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateRoleValidationSchemaType) => {
    setIsLoading(true);
    try {
      // the default permissions that every role needs
      const default_permissions: SystemPermissions[] = [
        "user_client:read", // to let user with this role read his profile info
        "user_client:update", // to let user with this role edit his profile info
        "reservation-client:read", // to let user with this read his reservations
        "panel:access" // to access the dashboard
      ];

      // create the role
      await crud_create_role({
        color: data.color,
        name: data.name,
        permissions: [
          ...default_permissions,
          ...(data.permissions as SystemPermissions[]),
        ],
      });

      // to the roles page
      router.push("/roles");
      // tost
      toast.success("Role Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
        <div className="w-full min-h-screen">
          {/* header */}
          <CreationTabsContent>
            <CreationTabsTab
              hash="#main-information"
              selected={hash == "#main-information"}
              ref={section_main_info_ref}
            >
              Main Information
            </CreationTabsTab>

            <CreationTabsTab
              hash="#permissions"
              selected={hash == "#permissions"}
              ref={section_permissions_ref}
            >
              Permissions & Access
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <CreateRole_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* permissions section */}
              <CreateRolePermissions_Section
                ref={section_permissions_ref}
                id="#permissions"
              />
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/blogs")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* cancel */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create Role
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
