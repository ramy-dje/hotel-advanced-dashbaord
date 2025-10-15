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
import { forwardRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateCRMContactValidationSchemaType } from "./create-contact-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Button } from "@/components/ui/button";
import ProfileBadgeField from "./ProfileBadgeField";
import { countries } from "@/lib/data/countries";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DropZone from "@/components/upload-files/drop-zone";
import UploadedImageItem from "@/components/uploaded-image";
import { useStates } from "@/hooks/use-states";

// Create crm contact personal info section

const maxFileSize = 1024 * 1024 * 2; // 2MB

interface Props {
  id?: string;
}



const CreateCRMContact_PersonalInformation_Section = forwardRef<
  HTMLDivElement,
  Props
>(({ id }, ref) => {
  const {
    formState: { errors, disabled },
    register,
    control,
  } = useFormContext<CreateCRMContactValidationSchemaType>();

  const stateController = useController({
    control,
    name: "location_state",
    defaultValue: "",
  });

  // gender controller
  const genderController = useController({
    control,
    name: "gender",
    defaultValue: "male",
  });

  // image controller
  const image_controller = useController({
    control,
    defaultValue: null,
    name: "picture_file",
  });

  // image url controller
  const image_url_controller = useController({
    control,
    name: "picture_url",
  });
  // show bio field
  const [showBioField, setShowBioField] = useState(false);


  const [showMiddleName, setShowMiddleName] = useState(false);

  const countryController = useController({
    control,
    name: "location_country",
    defaultValue: "",
  });
  function codeToEmoji(isoCode: string): string {
    // Convert each character to its regional indicator symbol
    const codePoints = isoCode
      .toUpperCase()
      .split('')
      .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
  }
  function getFlagImage(isoCode: string): string {
    // URL structure for flag images (for example, using a free API or a CDN)
    const flagUrl = `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;

    return flagUrl;
  }

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>, setValue: any) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    value = value.replace(/(\d{2})(?=\d)/g, "$1 "); // Add space after every two digits

    // Update the value of the field using react-hook-form's setValue
    setValue("location_zipcode", value);
  };

  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
  const { setValue, watch } = useFormContext<CreateCRMContactValidationSchemaType>();

  const selectedCountryName = countries.find(
    (c) => c.code === countryController.field.value
  )?.name;

  const { states, loading: statesLoading, error: statesError } = useStates(selectedCountryName || "");



  // logic
  return (
    <CreationFormSection ref={ref} id={id}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>
          Personal Information
        </CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          The contacts's personal,location information section
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>
      <CreationFormSectionContent>
        {/* first name */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            type="text"
            disabled={disabled}
            placeholder="Name"
            {...register("firstName", { required: true })}
          />
          {errors?.firstName ? (
            <InlineAlert type="error">{errors.firstName.message}</InlineAlert>
          ) : null}
          {showMiddleName && (
            <div className="flex flex-col gap-2 mt-2">
              <Label htmlFor="middlename">Middle Name</Label>
              <Input
                id="middlename"
                type="text"
                disabled={disabled}
                placeholder="Middle Name"
                {...register("middleName")}
              />
              {errors?.middleName && (
                <InlineAlert type="error">{errors.middleName.message}</InlineAlert>
              )}

              <Button
                onClick={() => setShowMiddleName(false)}
                type="button"
                variant="quickAdd"
                size="null"
              >
                × Remove middle name
              </Button>


            </div>
          )}
          {!showMiddleName && (
            <Button
              onClick={() => setShowMiddleName(true)}
              type="button"
              variant="quickAdd"
              size="null"
            >
              + Add middle name
            </Button>
          )}

        </div>

        {/* last name */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            type="text"
            disabled={disabled}
            placeholder="Name"
            {...register("lastName", { required: true })}
          />
          {errors?.lastName ? (
            <InlineAlert type="error">{errors.lastName.message}</InlineAlert>
          ) : null}
          {/* middle name */}

        </div>

        {/* gender */}
        <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(e) => genderController.field.onChange(e)}
            value={genderController.field.value}
          >
            <SelectTrigger disabled={disabled} id="gender" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
          {errors?.gender ? (
            <InlineAlert type="error">{errors.gender.message}</InlineAlert>
          ) : null}
        </div>
        {/* Bio*/}
         <div className="flex flex-col  col-span-2 md:col-span-1 gap-2">
         <Label htmlFor="gender"><pre> </pre></Label>
          
            <Button
            className="w-full  
            bottom-0"
              type="button"
              onClick={() => setShowBioField(true)}
            >
              + Add Bio
            </Button>
          
        </div>
        {/* <div className="col-span-2 flex flex-col gap-2">
          {showBioField ? (
            <>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                className="w-full h-[6em] resize-none"
                disabled={disabled}
                placeholder="Bio, note about contact"
                {...register("bio", { required: true })}
              />
              {errors?.bio && (
                <InlineAlert type="error">{errors.bio.message}</InlineAlert>
              )}
              <Button
                type="button"
                variant="quickAdd"
                size="null"
                onClick={() => setShowBioField(false)}
              >
                × Remove Bio
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="quickAdd"
              size="null"
              onClick={() => setShowBioField(true)}
            >
              + Add Bio
            </Button>
          )}
        </div> */}

        {/* profile galley */}
        <ProfileBadgeField disabled={disabled} maxFileSize={2 * 1024 * 1024} />



        {/* location info */}
        {/* country */}

        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="country">Country</Label>

          <Select
            value={countryController.field.value}
            onValueChange={(value) => {
              countryController.field.onChange(value);
              setIsCountrySelectOpen(false);
            }}
            onOpenChange={(open) => {
              setIsCountrySelectOpen(open);
              if (open) {
                setCountrySearch("");
              }
            }}
          >
            <SelectTrigger id="country" disabled={disabled} className="w-full">
              {countryController.field.value ? (
                <div className="flex items-center gap-2 px-3 py-2">
                  <img
                    src={getFlagImage(countryController.field.value)}
                    alt="flag"
                    className="inline-block w-6 h-4"
                  />
                  <span>
                    {countries.find((c) => c.code === countryController.field.value)?.name}
                  </span>
                </div>
              ) : (
                <span className="px-3 py-2 text-muted-foreground">Choose Country</span>
              )}
            </SelectTrigger>

            <SelectContent className="p-0">
              {/* Fixed search bar */}
              <div className="p-1 border-b bg-background sticky top-0 z-10">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  // autoFocus
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Scrollable country list */}
              <div className="max-h-60 overflow-y-auto">
                {countries
                  .filter((country) =>
                    country.name.toLowerCase().includes(countrySearch.toLowerCase())
                  )
                  .map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <img
                          src={getFlagImage(country.code)}
                          alt={`${country.name} flag`}
                          className="inline-block mr-2 w-6 h-4"
                        />
                        {country.name}
                      </div>
                    </SelectItem>
                  ))}
              </div>
            </SelectContent>
          </Select>


          {errors?.location_country ? (
            <InlineAlert type="error">
              {errors.location_country.message}
            </InlineAlert>
          ) : null}
        </div>

        {/* <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            type="text"
            disabled={disabled}
            placeholder="Example (Algeria)"
            {...register("location_country", { required: true })}
          />
          {errors?.location_country ? (
            <InlineAlert type="error">
              {errors.location_country.message}
            </InlineAlert>
          ) : null}
        </div> */}

        {/* state */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="state">State</Label>

          {statesLoading ? (
            <div className="text-sm text-muted-foreground">Loading states…</div>
          ) : states.length > 0 ? (
            <Select
              value={stateController.field.value}
              onValueChange={(value) => stateController.field.onChange(value)}
            >
              <SelectTrigger id="state" disabled={disabled} className="w-full">
                <SelectValue placeholder="Choose state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="state"
              type="text"
              disabled={disabled}
              placeholder="Example (California)"
              {...register("location_state", { required: true })}
            />
          )}

          {statesError && (
            <InlineAlert type="error">{statesError}</InlineAlert>
          )}

          {errors?.location_state && (
            <InlineAlert type="error">{errors.location_state.message}</InlineAlert>
          )}
        </div>





        {/* <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            type="text"
            disabled={disabled}
            placeholder="Example (Algeria)"
            {...register("location_state", { required: true })}
          />
          {errors?.location_state ? (
            <InlineAlert type="error">
              {errors.location_state.message}
            </InlineAlert>
          ) : null}

        </div> */}

        {/* city */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            type="text"
            disabled={disabled}
            placeholder="Example (Algiers)"
            {...register("location_city", { required: true })}
          />
          {errors?.location_city ? (
            <InlineAlert type="error">
              {errors.location_city.message}
            </InlineAlert>
          ) : null}
        </div>

        {/* zipcode */}
        {/* <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="zipcode">Zipcode</Label>
          <Input
            id="zipcode"
            type="text"
            disabled={disabled}
            placeholder="Example (17 00 0)"
            value={watch("location_zipcode")} // Watch the current value of the zip code
            onChange={(e) => handleZipCodeChange(e, setValue)} // Call the handle change function
            {...register("location_zipcode", { required: true })}
          />
          {errors?.location_zipcode && (
            <InlineAlert type="error">
              {errors.location_zipcode.message}
            </InlineAlert>
          )}
        </div> */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="zipcode">Zipcode</Label>
          <Input
            id="zipcode"
            type="text"
            disabled={disabled}
            placeholder="Example (17 000)"
            {...register("location_zipcode", { required: true })}
          />
          {errors?.location_zipcode ? (
            <InlineAlert type="error">
              {errors.location_zipcode.message}
            </InlineAlert>
          ) : null}
        </div>

        {/* address */}
        <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            disabled={disabled}
            placeholder="Example (Dali Ibrahim)"
            {...register("location_address", { required: true })}
          />
          {errors?.location_address ? (
            <InlineAlert type="error">
              {errors.location_address.message}
            </InlineAlert>
          ) : null}
        </div>

        {/* Map preview */}
        <div className="flex flex-col col-span-2 w-full gap-2">
          <Label>Map Preview</Label>
          <div className="w-full h-64 border rounded overflow-hidden">
            <iframe
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${watch("location_address")}, ${watch("location_city")}`
              )}&output=embed`}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* bio */}
        {/* <div className="flex flex-col col-span-2 gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            className="w-full h-[6em] resize-none"
            disabled={disabled}
            placeholder="Bio,note about contact"
            {...register("bio", {
              required: true,
            })}
          />
          {errors?.bio ? (
            <InlineAlert type="error">{errors.bio.message}</InlineAlert>
          ) : null}
        </div> */}
        {/*}
        <div className="col-span-2">
          <Label className="block mb-2">Contact Picture (Optional)</Label>
          <div className="relative flex items-center justify-center w-full border-border border rounded-md">
            <DropZone
              disabled={disabled}
              placeholder="Drop or select image"
              setFiles={(f) => {
                // clear the old object url if existed
                if (image_url_controller.field.value) {
                  URL.revokeObjectURL(image_url_controller.field.value);
                }
                // set the url
                const url = URL.createObjectURL(f[0]);
                image_url_controller.field.onChange(url);
                // set the file
                image_controller.field.onChange(f[0]);
              }}
              className="border-0 w-full z-10"
              maxSize={maxFileSize}
              maxFiles={1}
              multiple={false}
              accept={{
                "image/png": [],
                "image/jpeg": [],
                "image/jpg": [],
                "image/webp": [],
              }}
            />
            <span className="absolute z-[9] select-none bottom-1 right-2 text-xs text-accent-foreground">
              Max Image Size 2MB
            </span>
          </div>
          <div className="w-full mb-2">
            {image_controller.field.value ? (
              <UploadedImageItem
                key={"img"}
                alt={"user picture"}
                className="mt-3"
                url={image_url_controller.field.value || ""}
                onRemove={() => {
                  // clear the object url
                  image_url_controller.field.value &&
                    URL.revokeObjectURL(image_url_controller.field.value);
                  // clear the file
                  image_controller.field.onChange(null);
                }}
                meta={{
                  name: image_controller.field.value.name,
                  size: image_controller.field.value.size,
                }}
              />
            ) : null}
          </div>
          {errors?.picture_file ? (
            <InlineAlert type="error">
              {errors.picture_file.message as string}
            </InlineAlert>
          ) : null}
        </div>*/}
      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

export default CreateCRMContact_PersonalInformation_Section;
