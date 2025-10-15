import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingAccountSection from "../account-section";
import { CreationFormFooterActions } from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import {
  SettingUserValidationSchema,
  SettingUserValidationSchemaType,
} from "./setting-validation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/use-auth";
import toast from "react-hot-toast";
import { UploadFile } from "@/lib/storage";
import { crud_update_profile } from "@/lib/curd/profile";
import SettingContactSection from "../contact-section";

// The setting page's form and tabs logic

interface Props {}

export default function SettingForm({}: Props) {
  // auth info
  const { user, refreshUser } = useAuth();
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<SettingUserValidationSchemaType>({
    resolver: zodResolver(SettingUserValidationSchema),
    defaultValues: {
      picture_file: null,
    },
  });

  // tabs (will be used to trigger the validation of the form)
  const [tab, setTab] = useState<"account" | "contact" | string>("account");

  // handle save changes
  const handleTriggerAndSaveChange = async () => {
    // if the user does't exist
    if (!user) return;
    // triggering the validation of the current tab's form
    if (tab == "account") {
      // triggering the account form validation
      const result = await methods.trigger([
        "fullname",
        "username",
        "picture_file",
        "picture_url",
        "picture_old_url",
        "password",
        "passwordConfirm",
      ]);

      // return if the form is invalid
      if (!result) return;

      // getting the data
      const data = methods.getValues();

      // setting the loading to 'true'
      setIsLoading(true);

      // update the users's info logic
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
        await crud_update_profile({
          fullName: data.fullname,
          username: data.username,
          pic: public_url,
          // if the password has changed
          ...(data.password ? { password: data.password } : {}),
        });

        // await refresh the user token
        await refreshUser();

        // clearing the image object URL
        if (data.picture_url) {
          URL.revokeObjectURL(data.picture_url);
        }

        // tost
        toast.success("Changes Successfully Saved");
      } catch (e) {
        setIsLoading(false);
        toast.error("Something Went Wrong, Try again");
      } finally {
        // setting the loading to 'false'
        setIsLoading(false);
      }
    } else if (tab == "contact") {
      // triggering the contact form validation
      const result = await methods.trigger([
        "location_city",
        "location_country",
        "location_state",
        "location_zipcode",
        "phoneNumber",
        "phoneNumber2",
      ]);

      // return if the form is invalid
      if (!result) return;

      // getting the data
      const data = methods.getValues();

      // setting the loading to 'true'
      setIsLoading(true);

      // update the users's info logic
      try {
        // update the user
        await crud_update_profile({
          location: {
            city: data.location_city,
            country: data.location_country,
            state: data.location_state,
            zipcode: data.location_zipcode,
          },
          phoneNumbers: [
            data.phoneNumber,
            ...(data.phoneNumber2 ? [data.phoneNumber2] : []),
          ],
        });

        // await refresh the user token
        await refreshUser();

        // tost
        toast.success("Changes Successfully Saved");
      } catch (e) {
        setIsLoading(false);
        toast.error("Something Went Wrong, Try again");
      } finally {
        // setting the loading to 'false'
        setIsLoading(false);
      }
    }
  };

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  // set the user's data to the form
  useEffect(() => {
    if (user) {
      // personal info
      methods.setValue("fullname", user.fullName);
      methods.setValue("username", user.username);
      methods.setValue("email", user.email);

      // location and numbers
      methods.setValue("location_country", user.location?.country);
      methods.setValue("location_state", user.location?.state);
      methods.setValue("location_city", user.location?.city);
      methods.setValue("location_zipcode", user.location?.zipcode);

      methods.setValue(
        "phoneNumber",
        (user.phoneNumber && user.phoneNumber[0]) || ""
      );

      methods.setValue(
        "phoneNumber2",
        (user.phoneNumber && user.phoneNumber[1]) || ""
      );

      // pictures
      methods.setValue("picture_file", user.pic || null);
      methods.setValue("picture_old_url", user.pic || "");
    }
  }, [user]);

  // reset the user data
  const resetUser = useCallback(() => {
    if (user) {
      // personal info
      methods.setValue("fullname", user.fullName);
      methods.setValue("username", user.username);
      methods.setValue("email", user.email);

      // location and numbers
      methods.setValue("location_country", user.location?.country);
      methods.setValue("location_state", user.location?.state);
      methods.setValue("location_city", user.location?.city);
      methods.setValue("location_zipcode", user.location?.zipcode);

      methods.setValue(
        "phoneNumber",
        (user.phoneNumber && user.phoneNumber[0]) || ""
      );

      methods.setValue(
        "phoneNumber2",
        (user.phoneNumber && user.phoneNumber[1]) || ""
      );

      // pictures
      methods.setValue("picture_file", user.pic || null);
      methods.setValue("picture_old_url", user.pic || "");
    }
  }, [user]);

  return (
    <div className="relative w-full flex flex-col gap-2">
      {/* tabs */}
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="account"
        className="w-full"
      >
        <TabsList className="">
          {/* tabs of sections */}
          <TabsTrigger value="account">
            Personal & Account Information
          </TabsTrigger>
          <TabsTrigger value="contact">
            Contact & Location Information
          </TabsTrigger>
        </TabsList>
        {/* form provider */}
        <FormProvider {...methods}>
          {/* content */}
          {/* contact form */}
          <TabsContent value="contact" className="w-full h-auto mt-0">
            <SettingContactSection />
          </TabsContent>

          {/* account & personal information form */}
          <TabsContent value="account" className="w-full h-auto mt-0">
            <SettingAccountSection />
          </TabsContent>
        </FormProvider>
      </Tabs>
      {/* save buttons */}
      <CreationFormFooterActions>
        <Button
          disabled={isLoading}
          type="button"
          variant="outline"
          onClick={resetUser}
        >
          {/* Save as draft */}
          Reset Information
        </Button>
        <Button
          disabled={isLoading}
          isLoading={isLoading}
          onClick={handleTriggerAndSaveChange}
          type="submit"
        >
          Save Changes
        </Button>
      </CreationFormFooterActions>
    </div>
  );
}
