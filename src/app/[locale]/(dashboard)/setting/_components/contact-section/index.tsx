import {
  CreationFormContent,
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import InlineAlert from "@/components/ui/inline-alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingUserValidationSchemaType } from "../setting-form/setting-validation.schema";
import { useFormContext } from "react-hook-form";

// The Contact Setting Contact Section Form

interface Props {}

function SettingContactSection({}: Props) {
  // form context
  const {
    formState: { errors, disabled },
    register,
  } = useFormContext<SettingUserValidationSchemaType>();

  return (
    <div className="w-full">
      {/* form */}
      <CreationFormContent className="min-h-screen flex flex-col gap-6">
        <CreationFormSection
          className="max-h-max"
          id={"account-information-section"}
        >
          <CreationFormSectionInfo>
            <CreationFormSectionInfoTitle>
              Contact & Location Information
            </CreationFormSectionInfoTitle>
            <CreationFormSectionInfoDescription>
              The location info and phone numbers information section
            </CreationFormSectionInfoDescription>
          </CreationFormSectionInfo>
          <CreationFormSectionContent>
            {/* phone number 1 */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="phone1">Phone Number</Label>
              <Input
                id="phone1"
                type="text"
                disabled={disabled}
                placeholder="0612345678"
                {...register("phoneNumber", { required: true })}
              />
              {errors?.phoneNumber ? (
                <InlineAlert type="error">
                  {errors.phoneNumber.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* phone number 2 */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="phone2">Phone Number 2 (Optional)</Label>
              <Input
                id="phone2"
                type="text"
                disabled={disabled}
                placeholder="0612345678"
                {...register("phoneNumber2", { required: true })}
              />
              {errors?.phoneNumber2 ? (
                <InlineAlert type="error">
                  {errors.phoneNumber2.message}
                </InlineAlert>
              ) : null}
            </div>
            {/* location info */}

            {/* country */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="country">Country (Optional)</Label>
              <Input
                id="country"
                type="text"
                disabled={disabled}
                placeholder="Your Country"
                {...register("location_country", { required: true })}
              />
              {errors?.location_country ? (
                <InlineAlert type="error">
                  {errors.location_country.message}
                </InlineAlert>
              ) : null}
            </div>

            {/* state */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="state">State (Optional)</Label>
              <Input
                id="state"
                type="text"
                disabled={disabled}
                placeholder="Your state"
                {...register("location_state", { required: true })}
              />
              {errors?.location_state ? (
                <InlineAlert type="error">
                  {errors.location_state.message}
                </InlineAlert>
              ) : null}
            </div>

            {/* city */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="city">City (Optional)</Label>
              <Input
                id="city"
                type="text"
                disabled={disabled}
                placeholder="Your city"
                {...register("location_city", { required: true })}
              />
              {errors?.location_city ? (
                <InlineAlert type="error">
                  {errors.location_city.message}
                </InlineAlert>
              ) : null}
            </div>

            {/* zipcode */}
            <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
              <Label htmlFor="zipcode">Zipcode (Optional)</Label>
              <Input
                id="zipcode"
                type="text"
                disabled={disabled}
                placeholder="Your city's zipcode"
                {...register("location_zipcode", { required: true })}
              />
              {errors?.location_zipcode ? (
                <InlineAlert type="error">
                  {errors.location_zipcode.message}
                </InlineAlert>
              ) : null}
            </div>
          </CreationFormSectionContent>
        </CreationFormSection>
      </CreationFormContent>
    </div>
  );
}

export default SettingContactSection;
