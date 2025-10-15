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
  UpdateUserValidationSchema,
  UpdateUserValidationSchemaType,
} from "./components/update-user-validation.schema";
import RoleInterface from "@/interfaces/role.interface";
import { UploadFile } from "@/lib/storage";
import { crud_update_user } from "@/lib/curd/user";
import { UserInterface } from "@/interfaces/user.interfaces";
import UpdateUser_PersonalInformation_Section from "./components/personal-info.section";
import UpdateUser_AccountInformation_Section from "./components/account-info.section";
import UpdateUser_ContactInformation_Section from "./components/contact-info.section";

interface Props {
  oldUser: UserInterface;
  formData: {
    roles: RoleInterface[];
  };
}

export default function UpdateUserFrom({ formData, oldUser }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateUserValidationSchemaType>({
    resolver: zodResolver(UpdateUserValidationSchema),
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

  // set the old user data
  useEffect(() => {
    // set the old user data to the form
    if (oldUser) {
      // personal info
      methods.setValue("fullname", oldUser.profileInfo.fullName);
      methods.setValue("gender", oldUser.profileInfo.gender);
      // account info
      methods.setValue("username", oldUser.profileInfo.username);
      methods.setValue("email", oldUser.profileInfo.email);
      methods.setValue("role", oldUser.access.role.id);
      // location and numbers
      methods.setValue(
        "location_country",
        oldUser.profileInfo.location?.country
      );
      methods.setValue("location_state", oldUser.profileInfo.location?.state);
      methods.setValue("location_city", oldUser.profileInfo.location?.city);
      methods.setValue(
        "location_zipcode",
        oldUser.profileInfo.location?.zipcode
      );

      methods.setValue(
        "phoneNumber",
        (oldUser.profileInfo.phoneNumber &&
          oldUser.profileInfo.phoneNumber[0]) ||
          ""
      );

      methods.setValue(
        "phoneNumber2",
        (oldUser.profileInfo.phoneNumber &&
          oldUser.profileInfo.phoneNumber[1]) ||
          ""
      );

      // pictures
      methods.setValue("picture_file", oldUser.profileInfo.pic || null);
      methods.setValue("picture_old_url", oldUser.profileInfo.pic || "");
    }
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateUserValidationSchemaType) => {
    if (!oldUser) return;
    setIsLoading(true);
    try {
      // upload the image
      let public_url = "";

      // if the image is changed
      if (
        typeof data.picture_file == "string" &&
        data.picture_file == data.picture_old_url
      ) {
        // old image
        public_url = data.picture_old_url;
      } else if (data.picture_file instanceof File) {
        // new image
        // upload the image
        public_url = await UploadFile(data.picture_file, "profile");
      }

      // update the user
      await crud_update_user(oldUser.id, {
        fullName: data.fullname,
        username: data.username,
        gender: data.gender,
        location: {
          city: data.location_city,
          country: data.location_country,
          state: data.location_state,
          zipcode: data.location_zipcode,
        },
        // if the password has changed
        ...(data.password ? { password: data.password } : {}),
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
      toast.success("User Updated Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleUpdate)}>
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
              <UpdateUser_PersonalInformation_Section
                ref={section_personal_info_ref}
                id="#personal-information"
              />
              {/* account info section */}
              <UpdateUser_AccountInformation_Section
                ref={section_account_info_ref}
                roles={formData.roles}
                id="#account-information"
              />
              {/* contact info */}
              <UpdateUser_ContactInformation_Section
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
            Update User
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
