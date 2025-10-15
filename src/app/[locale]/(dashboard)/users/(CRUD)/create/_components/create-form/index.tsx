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
  CreateUserValidationSchema,
  CreateUserValidationSchemaType,
} from "./components/create-user-validation.schema";
import RoleInterface from "@/interfaces/role.interface";
import CreateUser_PersonalInformation_Section from "./components/personal-info.section";
import CreateUser_AccountInformation_Section from "./components/account-info.section";
import CreateUser_ContactInformation_Section from "./components/contact-info.section";
import { UploadFile } from "@/lib/storage";
import { crud_create_user } from "@/lib/curd/user";

interface Props {
  formData: {
    roles: RoleInterface[];
  };
}

export default function CreateUserFrom({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateUserValidationSchemaType>({
    resolver: zodResolver(CreateUserValidationSchema),
    defaultValues: {
      role: "",
      picture_file: null,
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_personal_info_ref = useRef<HTMLDivElement>(null);
  const section_account_info_ref = useRef<HTMLDivElement>(null);
  const section_contact_info_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("fullname");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    // methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateUserValidationSchemaType) => {
    setIsLoading(true);
    try {
      // upload the image
      const public_url = data.picture_file
        ? await UploadFile(data.picture_file, "profile")
        : "";

      // create the user
      await crud_create_user({
        email: data.email,
        fullName: data.fullname,
        username: data.username,
        gender: data.gender,
        location: {
          city: data.location_city,
          country: data.location_country,
          state: data.location_state,
          zipcode: data.location_zipcode,
        },
        password: data.password,
        pic: public_url,
        role: data.role,
        phoneNumbers: [
          data.phoneNumber,
          ...(data.phoneNumber2 ? [data.phoneNumber2] : []),
        ],
      });
      // clearing the image object URL
      if (data.picture_url) {
        URL.revokeObjectURL(data.picture_url);
      }
      // to the users page
      router.push("/users");
      // tost
      toast.success("User Created Successfully");
    } catch (err) {
      setIsLoading(false);
      if (err == 409) {
        // this email is used
        methods.setError(
          "email",
          {
            message: "Email Is Used Before",
          },
          {
            shouldFocus: true, // to focus on the email input
          }
        );
        // scroll to the account section
        section_account_info_ref.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
      } else {
        toast.error("Something went wrong");
      }
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
              hash="#personal-information"
              selected={hash == "#personal-information"}
              ref={section_personal_info_ref}
            >
              Personal Information
            </CreationTabsTab>

            <CreationTabsTab
              hash="#account-information"
              selected={hash == "#account-information"}
              ref={section_account_info_ref}
            >
              Account Information
            </CreationTabsTab>

            <CreationTabsTab
              hash="#contact-information"
              selected={hash == "#contact-information"}
              ref={section_contact_info_ref}
            >
              Contact Information
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* personal info section */}
              <CreateUser_PersonalInformation_Section
                ref={section_personal_info_ref}
                id="#personal-information"
              />
              {/* account info section */}
              <CreateUser_AccountInformation_Section
                ref={section_account_info_ref}
                roles={formData.roles}
                id="#account-information"
              />
              {/* contact info */}
              <CreateUser_ContactInformation_Section
                ref={section_contact_info_ref}
                id="#contact-information"
              />
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/users")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* cancel */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create User
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
