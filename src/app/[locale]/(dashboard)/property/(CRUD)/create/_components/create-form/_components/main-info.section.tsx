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
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { RiSparkling2Fill } from "react-icons/ri";
import InlineAlert from "@/components/ui/inline-alert";
import TextEditor from "@/components/text-editor";
import DropZone from "@/components/upload-files/drop-zone";
import { Switch } from "@/components/ui/switch";
import CreatePropertyDirectoryPopup from './create_directory_popup'
import { countries } from "@/lib/data/countries";
import useAccess from "@/hooks/use-access";
import { MdOutlineKingBed, MdOutlineMeetingRoom } from "react-icons/md";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Check as CheckIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePropertyInterface } from "@/interfaces/property.interface";
import PropertyGallerySection from "./propertyGallerySection";
import { Button } from "@/components/ui/button";
import { watch } from "fs";
import { ToggleInput } from "./toggle_button";
import { useStates } from "@/hooks/use-states";
import EnergyDetailsPopup from "./energy-details_popup";
import { crud_getAll_propertyDirectories } from "@/lib/curd/property-directory";
import PropertyDirectoryInterface from "@/interfaces/property-directory.interface";
import CreatePropertyTypePopup from "./create-type-popup";
import { crud_getAll_propertyTypes } from "@/lib/curd/property-type";
import PropertyTypeInterface from "@/interfaces/property-type.interface";
import CreatePropertyListingPopup from "./create-property-multistep.tsx";
// import { Switch } from "@radix-ui/react-switch";

interface Props { id: string; }

const CreateProperty_MainInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const { control, formState: { errors, disabled }, register } = useFormContext<CreatePropertyInterface>();
    const bioCtrl = useController({ control, name: "bio" });
    const galleryCtrl = useController({ control, name: "imageGallery" });
    const videoTextCtrl = useController({ control, name: "videoText" });
    const videoLinkCtrl = useController({ control, name: "videoExternalLink" });
    const videoFileCtrl = useController({ control, name: "videoFile" });
    const video360Ctrl = useController({ control, name: "video360" });
    const typeCtrl = useController({ control, name: "addType" });

    const [countrySearch, setCountrySearch] = useState("");
    const [directoryList, setDirectoryList] = useState<PropertyDirectoryInterface[]>([]);
    const [typeList, setTypeList] = useState<PropertyTypeInterface[]>([]);
    const [showDirectoryPopup, setShowDirectoryPopup] = useState(false);
    const [selectedDirectory, setSelectedDirectory] = useState<string[]>([]);
    const { setValue, watch } = useFormContext<CreatePropertyInterface>();
    const { has } = useAccess();

    const countryController = useController({
      control,
      name: "location_country",
      defaultValue: "",
    });

    const selectedCountryName = countries.find(
      (c) => c.code === countryController.field.value
    )?.name;
    // const { states, loading: statesLoading, error: statesError } = useStates(selectedCountryName || "");
    const fetchDirectories = async () => {
      const response = await crud_getAll_propertyDirectories();
      setDirectoryList(response);
    };
    const fetchTypes = async () => {
      const response = await crud_getAll_propertyTypes();
      setTypeList(response);
    };

    // Fetch directories on component mount
    useEffect(() => {
      fetchDirectories();
      fetchTypes();
    }, []);


    return (
      <CreationFormSection ref={ref} id={`${id}-main`}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Main Details</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Enter the basic information and media for the property
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>


          <div className="flex flex-col gap-2">
            <Label htmlFor="propertyName">Property Name</Label>
            <Input id="propertyName" disabled={disabled} {...register("propertyName", { required: true })} placeholder="Enter Property Name" />
            {errors.propertyName && <InlineAlert type="error">{errors.propertyName.message}</InlineAlert>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Property Code</Label>
            <Input id="code" disabled={disabled} {...register("code", { required: true })} placeholder="Enter Property Code" />
            {errors.code && <InlineAlert type="error">{errors.code.message}</InlineAlert>}
          </div>


          <div className="flex flex-col gap-2">
            <Label htmlFor="propertyOwner">Property Owner</Label>
            <Input id="propertyOwner" disabled={disabled} {...register("propertyOwner", { required: true })} placeholder="Enter Property Owner" />
            {errors.propertyOwner && <InlineAlert type="error">{errors.propertyOwner.message}</InlineAlert>}
          </div>



          <div className="flex flex-col gap-2">
            <Label htmlFor="carParkSpaces">Property for</Label>
            <Input
              type="text"
              className="col-span-1"
              id="carParkSpaces"
              placeholder="E.g. for rent"
              disabled={disabled}
            // {...register("propertyFor")}
            />
          </div>



          {/* Directory Selector */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="directory">Directory</Label>
            <div className="flex items-center gap-2">
              <Select
                value={watch("directory")?.id || ""}
                onValueChange={(val) => {
                  const selectedDir = directoryList.find((dir) => dir.id === val);
                  setValue("directory", selectedDir);
                }}
                disabled={disabled}
              >
                <SelectTrigger id="directory">
                  <SelectValue placeholder="Select a directory" />
                </SelectTrigger>
                <SelectContent>
                  {directoryList.length > 0 ? (
                    directoryList.map((dir) => (
                      <SelectItem key={dir.id} value={dir.id}>
                        {dir.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No directories available
                    </div>
                  )}
                </SelectContent>
              </Select>


              {has(["property_directory:create"]) ? <CreatePropertyDirectoryPopup onCreated={() => fetchDirectories()} /> : null}


            </div>

            {errors.directory && (
              <InlineAlert type="error">{String(errors.directory.message)}</InlineAlert>
            )}
          </div>



         



           {/* Type Selector */}
           <div className="flex flex-col gap-2">
            <Label htmlFor="directory">Type</Label>
            <div className="flex items-center gap-2">
              <Select
                value={watch("addType")?.id || ""}
                onValueChange={(val) => {
                  const selectedType = typeList.find((type) => type.id === val);
                  setValue("addType", selectedType);
                }}
                disabled={disabled}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {typeList.length > 0 ? (
                    typeList.map((dir) => (
                      <SelectItem key={dir.id} value={dir.id}>
                        {dir.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No Types available
                    </div>
                  )}
                </SelectContent>
              </Select>


              {has(["property_type:create"]) ? <CreatePropertyTypePopup onCreated={() => fetchTypes()} /> : null}


            </div>

            {errors.directory && (
              <InlineAlert type="error">{String(errors.directory.message)}</InlineAlert>
            )}
          </div>







          
          

          {/* Surface Area */}
          <div className="flex flex-col  gap-2">
            <Label>Surface Area</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                disabled={disabled}
                placeholder="Value"
                {...register("surfaceValue")}
              />
              <Select
                {...register("surfaceUnit")}
                disabled={disabled}
                defaultValue="sqm"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent {...register("surfaceUnit")}>
                  <SelectItem value="sqm">sqm</SelectItem>
                  <SelectItem value="sqft">sqft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="carParkSpaces">Year of build</Label>
            <Input
              type="dateyear"
              className="col-span-1"
              id="carParkSpaces"
              placeholder="E.g. 2020"
              disabled={disabled}
            // {...register("propertyFor")}
            />
          </div>
          <div className="flex flex-col gap-4 col-span-2">
            <Label htmlFor="description">Description</Label>
            <TextEditor
              content={bioCtrl.field.value || ""}
              setContent={(n) => {
                bioCtrl.field.onChange(n);
              }}
              disabled={disabled}
              className="col-span-2 h-[7em] mb-[3em]"
              placeholder="Description Of The Property"
              {...register("bio")}
            />
            {errors?.bio ? (
              <InlineAlert type="error">
                {errors.bio.message}
              </InlineAlert>
            ) : null}
          </div>

        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

const CreateProperty_LocationInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {

    const { formState: { errors, disabled }, register, control } = useFormContext<CreatePropertyInterface>();
    const countryController = useController({
      control,
      name: "location_country",  // Fixed to match main section
      defaultValue: ""
    });
    const stateController = useController({
      control,
      name: "location_state",  // Fixed for consistency
      defaultValue: ""
    });
    const [isCountrySelectOpen, setIsCountrySelectOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState("");
    const [showAddressLabelInput, setShowAddressLabelInput] = useState(false);

    const { setValue, watch } = useFormContext<CreatePropertyInterface>();

    const selectedCountryName = countries.find(
      c => c.code === countryController.field.value
    )?.name || "";

    const { states, loading: statesLoading, error: statesError } =
      useStates(selectedCountryName);

    // Reset state when country changes
    useEffect(() => {
      stateController.field.onChange("");
    }, [countryController.field.value]);


    function getFlagImage(isoCode: string): string {
      // URL structure for flag images (for example, using a free API or a CDN)
      const flagUrl = `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;

      return flagUrl;
    }
    return (
      <CreationFormSection ref={ref} id={`${id}-location`}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Location Details</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Enter the address and map information
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
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
          {/* state */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="state">State</Label>

            {statesLoading ? (
              <div className="text-sm text-muted-foreground">Loading states...</div>
            ) : states.length > 0 ? (
              <Select
                value={stateController.field.value}
                onValueChange={stateController.field.onChange}
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
                {...stateController.field}  // Fixed to use controller
              />
            )}

            {statesError && (
              <InlineAlert type="error">{statesError}</InlineAlert>
            )}

            {errors?.location_state && (
              <InlineAlert type="error">
                {errors.location_state.message}
              </InlineAlert>
            )}
          </div>
          {/* city */}
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              disabled={disabled}
              placeholder="Example (Algiers)"
              {...register("city", { required: true })}
            />
            {errors?.city ? (
              <InlineAlert type="error">
                {errors.city.message}
              </InlineAlert>
            ) : null}
          </div>
          <div className="flex flex-col col-span-2 lg:col-span-1 w-full gap-2">
            <Label htmlFor="zipcode">Zipcode</Label>
            <Input
              id="zipcode"
              type="text"
              disabled={disabled}
              placeholder="Example (17 000)"
              {...register("zipCode", { required: true })}
            />
            {errors?.zipCode ? (
              <InlineAlert type="error">
                {errors.zipCode.message}
              </InlineAlert>
            ) : null}
          </div>

          {/* address */}
          <div className="flex flex-col col-span-2 lg:col-span-2 gap-2">
            <Label htmlFor="streetAddress">Street Address</Label>
            <div className="flex items-center col-span-2 lg:col-span-2 w-full gap-2">

              <Input
                id="streetAddress"
                type="text"
                disabled={disabled}
                placeholder="Example (Dali Ibrahim)"
                {...register("streetAddress", { required: true })}
              />
              {errors?.streetAddress && (
                <InlineAlert type="error">
                  {errors.streetAddress.message}
                </InlineAlert>
              )}

              {/* ——— Address Label UI ——— */}
              {!showAddressLabelInput ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddressLabelInput(true)}
                  className="flex items-center col-span-2 lg:col-span-1 gap-2"
                >
                  {watch("addressLabel") || "+ Add Label"}
                </Button>
              ) : (
                <div className="flex items-center col-span-2 lg:col-span-1 gap-2">
                  <Input
                    id="addressLabel"
                    type="text"
                    disabled={disabled}
                    placeholder="e.g., Home, Office…"
                    {...register("addressLabel")}
                    className="flex items-center col-span-2 lg:col-span-1 gap-2"
                  />
                  <Button
                    size="sm"
                    onClick={() => setShowAddressLabelInput(false)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setValue("addressLabel", "");
                      setShowAddressLabelInput(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {/* ———————————————————— */}
            </div>
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
                  `${watch("streetAddress")}, ${watch("city")}, ${watch("location_country")}, ${watch("location_state")}}`
                )}&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

interface Props { id: string; }

const energyA = ['A+++', 'A++', 'A+', 'A'];
const energyBC = ['B', 'C'];
const energyD = ['D'];
const energyEFG = ['E', 'F', 'G'];

const CreateProperty_EnergyClass_Section = forwardRef<HTMLDivElement, Props>(({ id }, ref) => {



  const { control, formState: { errors, disabled }, register } = useFormContext();
  const energyCtrl = useController({ control, name: "energyClass" });
  const toggleClass = (cls: string) => {
    const current: string[] = energyCtrl.field.value || [];
    const next = current.includes(cls)
      ? current.filter(c => c !== cls)
      : [...current, cls];
    energyCtrl.field.onChange(next);
  };
  const renderButtons = (classes: string[], colorOn: string, colorOff: string) =>
    classes.map((cls) => {
      const selected = (energyCtrl.field.value || []).includes(cls);
      return (
        <button
          key={cls}
          type="button"
          onClick={() => toggleClass(cls)}
          disabled={disabled}
          className={`w-full py-2 rounded text-center ${selected ? colorOn : colorOff
            }`}
        >
          {cls}
        </button>
      );
    });
  return (
    <CreationFormSection ref={ref} id={`${id}-setup`}>
      <CreationFormSectionInfo>
        <CreationFormSectionInfoTitle>Setup Details</CreationFormSectionInfoTitle>
        <CreationFormSectionInfoDescription>
          Enter additional setup options for the property
        </CreationFormSectionInfoDescription>
      </CreationFormSectionInfo>

      <CreationFormSectionContent>
        {/* <div className="flex flex-col gap-4 col-span-2"> */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">Global Energy Performance Index</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. 97.5 kWh/m²"
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">Renewable Energy Performance Index</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. 0.00 kWh/m²"
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">Energy Performance Of The Building</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. "
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">Heating System Type</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. Gas, Electric, etc."
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">EPC Current Rating</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. "
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="carParkSpaces">EPC Potential Rating</Label>
          <Input
            type="text"
            className="col-span-1"
            id="carParkSpaces"
            placeholder="E.g. "
            disabled={disabled}
          // {...register("propertyFor")}
          />
        </div>
        <div className="flex col-span-2 w-full justify-end">
          <EnergyDetailsPopup />
          {/* <Button variant="link" className="underline m-0 p-0 h-auto"><RiSparkling2Fill />&nbsp;Manage More</Button> */}
        </div>
        <div className="flex flex-col col-span-2 gap-2">

          <Label htmlFor="energyClass">Energy Class</Label>

          {/* All buttons in a single horizontal row with no gaps */}
          <div className="flex">
            {renderButtons(energyA, 'bg-green-600 text-white rounded-none', 'bg-green-200 text-green-800 rounded-none')}
            {renderButtons(energyBC, 'bg-yellow-500 text-white rounded-none', 'bg-yellow-200 text-yellow-800 rounded-none')}
            {renderButtons(energyD, 'bg-orange-500 text-white rounded-none', 'bg-orange-200 text-orange-800 rounded-none')}
            {renderButtons(energyEFG, 'bg-red-500 text-white rounded-none', 'bg-red-200 text-red-800 rounded-none')}
          </div>

          {errors.energyClass && (
            <InlineAlert type="error">
              {String(errors.energyClass.message)}
            </InlineAlert>
          )}</div>

      </CreationFormSectionContent>
    </CreationFormSection>
  );
});

const CreateProperty_SetupInformation_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const { control, formState: { errors, disabled }, register } = useFormContext();
    const carParkCtrl = useController({ control, name: "carPark" });
    const { has } = useAccess();

    const { setValue, watch } = useFormContext();

    return (
      <CreationFormSection ref={ref} id={`${id}-setup`}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Setup Details</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Enter additional setup options for the property
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent>
          <div className="flex flex-col gap-2">
            <Label htmlFor="carParkSpaces">Price Starting from</Label>
            <Input
              type="number"
              className="col-span-1"
              id="carParkSpaces"
              placeholder="e.g. 100"
              disabled={disabled}
              {...register("startPrice", { valueAsNumber: true })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="carParkSpaces">To</Label>
            <Input
              type="number"
              className="col-span-1"
              id="carParkSpaces"
              placeholder="E.g. 620"
              disabled={disabled}
              {...register("maxPrice", { valueAsNumber: true })}
            />
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

const CreateProperty_AdditionalDetails_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    return (
      <CreationFormSection ref={ref} id={`${id}-setup`}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Tell us what your property has to offer</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Describe your property's features to help guests know what to expect.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          <CreatePropertyListingPopup />
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);


export {
  CreateProperty_MainInformation_Section,
  CreateProperty_LocationInformation_Section,
  CreateProperty_EnergyClass_Section,
  CreateProperty_SetupInformation_Section,
  CreateProperty_AdditionalDetails_Section
};