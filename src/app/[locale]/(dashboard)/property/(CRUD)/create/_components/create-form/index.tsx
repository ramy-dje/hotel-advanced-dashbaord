
import {
  CreateProperty_MainInformation_Section,
  CreateProperty_LocationInformation_Section,
  CreateProperty_EnergyClass_Section,
  CreateProperty_SetupInformation_Section,
  CreateProperty_AdditionalDetails_Section
} from "./_components/main-info.section";
import PropertyGallerySection from "./_components/propertyGallerySection";
import { CreatePropertyValidationSchema } from "./create-property-validation.schema";
import { CreatePropertyValidationSchemaType } from "./create-property-validation.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { CreationFormContent, CreationFormFooterActions } from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { crud_create_propertyType } from "@/lib/curd/property-types";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { z } from "zod";
import BlocksManager from "./_components/floors.section";
import CreateProperty_Features_Section from "./_components/features.section";
import { CreatePropertyInterface } from "@/interfaces/property.interface";
import { PetsVisitorsSection, CleanlinessSection, UtilitiesSection, SecuritySection, FamilyChildrenSection, FieldArraySection } from "./_components/house-rules.section";
import { SearchParametersSection } from "./_components/house-setting.section";
import CreateProperty_HousePolicies_Section from "./_components/house-policies.section";
import useAccess from "@/hooks/use-access";

type FormDataType = z.infer<typeof CreatePropertyValidationSchema>;


export default function CreatePropertyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { has } = useAccess();

  const methods = useForm<FormDataType>({
    resolver: zodResolver(CreatePropertyValidationSchema),
    defaultValues: {
      blocks: [],
      propertyName: "",
      propertyOwner: "",
      code: "",
      bio: "",
      imageGallery: [],
      streetAddress: "",
      location_country: "",
      location_state: "",
      city: "",
      zipCode: "",
      addType: {
        name: "",
        id: "",
      },
      surfaceValue: 0,
      surfaceUnit: "sqm",
      roomTypes: [],
      roomRatings: {},
      carPark: false,
      houseFeatures: [],
      energyClass: [],
      directory: {
        id: "",
        name: "",
        type: "top-level",
        createdAt: "",
        updatedAt: "",
        parent_id: "",
      },
      houseViewsText: "",
      houseViewList: [],
      views: [],
      videoExternalLink: "",
      video360: "",
      gmapAddress: "",
      nearbyLocations: [],
      housePolicies: [],
      houseSettings: {
        houseSearchParams: {
          minNights: 0,
          minRooms: 0,
          adultsFrom: 0,
          adultsTo: 0,
          childrenFrom: 0,
          childrenTo: 0,
          closingFrom: "",
          closingTo: "",
          closingReason: "",
          closingTypes: [],
          modificationMode: "",
        },
      },
      houseRules: {
        quietHours: { start: "", end: "" },
        noParties: false,
        smokingAllowed: false,
        smokingAreas: "",
        petsAllowed: false,
        petConditions: "",
        visitorsAllowed: false,
        visitorHours: "",
        allowCancellations: false,
        loginRequired: false,
        extraServices: false,
        guestResponsibilities: "",
        cleaningFee: "none",
        reportDamages: false,
        wifiGuidelines: "",
        applianceRules: "",
        sharedSpaceRules: "",
        climateControlRules: "",
        accessInstructions: "",
        lockingPolicy: "required",
        noUnauthorizedAccess: false,
        childFriendly: false,
        childAgeRestrictions: "",
        babyEquipment: "",
        childproofing: "none"
      },
      // --- START: Multi-step popup fields (Added/Modified) ---
      propertySpecificType: "single", // "single unit" or "multi unit"
      rooms: 0,
      apartments: 0,
      bedsCount: 0,
      bedTypes: [],
      bathroomsCount: 0,
      bathroomTypes: [],
      guests: 0,
      accommodationCategories: [],
      facilities: {
        facilitiesCount: 0,
        otherFacilities: [],
        selectedFacilities: {},
      },
      propertyRating: 0,
      additionalInfo: {
        parkingSpaces: 0,
        extraAreasCount: 0,
        extraAreaNames: []
      }

    },
  });
  const router = useRouter();
  const [hash] = useHash();
  const [tab, setTab] = useState<string>("property-main-details");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = useCallback(async () => {
    setIsLoading(true);
    const data: CreatePropertyValidationSchemaType = methods.getValues();

    console.log("before payload Form Data:", data);

    try {
      const payload: Omit<CreatePropertyInterface, "slug"> = {
        propertyName: data.propertyName,
        propertyOwner: data.propertyOwner,
        code: data.code,
        bio: data.bio,
        addType: data.addType,
        directory: data.directory,
        houseRules: data.houseRules,
        housePolicies: data.housePolicies,
        houseSettings: data.houseSettings,
        rating: data.rating,
        location_country: data.location_country,
        location_state: data.location_state,
        blocks: data.blocks.map(b => ({
          block_name: b.block_name,
          description: b.description ?? '',
          hasRooms: b.hasRooms ?? false,
          hasFacilities: b.hasFacilities ?? false,
          floors: (b.floors ?? []).map(f => ({
            name: f.name,
            level: f.level ?? 0,
            surfaceArea: f.surfaceArea ?? 0,
            surfaceUnit: f.surfaceUnit ?? 'sqm',
            rooms: f.rooms ?? [],
            hasRooms: f.hasRooms ?? false,
            energyClass: f.energyClass ?? [],
            sections: f.sections ?? [],
            hasFacilities: f.hasFacilities ?? false,
            facilities: (f.facilities ?? []).map(fac => ({
              name: fac.name,
              sectionName: fac.sectionName ?? '',
            })),
            elevators: (f.elevators ?? []).map(e => ({
              name: e.name,
              sectionName: e.sectionName ?? '',
            })),
            AdditionalFeatures: f.AdditionalFeatures ?? [], // Add missing properties
            ExtraAreas: f.ExtraAreas ?? [],
            side: f.side ?? 'N',
          })),
        })),
        imageGallery: data.imageGallery,
        video360: data.video360 || '',
        streetAddress: data.streetAddress,
        city: data.city,
        zipCode: data.zipCode,
        gmapAddress: data.gmapAddress,
        surfaceValue: data.surfaceValue || 0,
        surfaceUnit: data.surfaceUnit || 'sqm',
        carPark: data.carPark || false,
        energyClass: data.energyClass || [],
        features: data.houseFeatures || [],
        views: data.views || [],
        houseViewsText: data.houseViewsText || '',
        nearbyLocations: data.nearbyLocations || [],
        // --- START: Multi-step popup fields (Added to payload) ---
        propertySpecificType: data.propertySpecificType,
        rooms: data.rooms,
        apartments: data.apartments,
        bedsCount: data.bedsCount,
        roomTypes: data.roomTypes,
        roomRatings: data.roomRatings,
        bedTypes: data.bedTypes,
        bathroomsCount: data.bathroomsCount,
        bathroomTypes: data.bathroomTypes,
        guests: data.guests,
        accommodationCategories: data.accommodationCategories,
        facilities: data.facilities,
        additionalInfo: data.additionalInfo,
        propertyRating: data.propertyRating,
        // --- END: Multi-step popup fields ---
      };
      console.log("payload", payload);
      console.log("data", data);

      if (!has(["property:create"])) {
        toast.error("You do not have permission to create a property");
        return;
      }

      await crud_create_propertyType(payload);
      toast.success("Property created successfully");
      // router.push("/property");
      methods.reset();
    } catch (err) {
      toast.error("Failed to create property");
      console.error("Error creating property:", err);
    }
    setIsLoading(false);
  }, [methods, router]);

  return (
    <div className="relative w-full flex flex-col gap-2">
      <Tabs
        value={tab}
        onValueChange={setTab}
        defaultValue="property-main-details"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger disabled={isLoading} value="property-main-details">
            Main Details
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-floors-info">
            Floor Plan
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-features-info">
            Features
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-house-rules">
            House Rules
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-house-policies">
            House Policies
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-house-settings">
            House Settings
          </TabsTrigger>
          <TabsTrigger disabled={isLoading} value="property-contact-info">
            Contact
          </TabsTrigger>
        </TabsList>
        <FormProvider {...methods}>
          <TabsContent value="property-main-details" className="w-full mt-4">
            <CreationFormContent className="w-full min-h-screen">
              <CreateProperty_MainInformation_Section id="#main" />
              <PropertyGallerySection id={`#gallery`} />
              <CreateProperty_LocationInformation_Section id="#location" />
              <CreateProperty_EnergyClass_Section id="#energy" />
              <CreateProperty_SetupInformation_Section id="#setup" />
              <CreateProperty_AdditionalDetails_Section id="#additional" />
            </CreationFormContent>
          </TabsContent>

          <TabsContent value="property-floors-info" className="w-full mt-4">
            <CreationFormContent>
              <BlocksManager id="#floors" />
            </CreationFormContent>
          </TabsContent>

          <TabsContent value="property-features-info" className="w-full mt-4">
            <CreationFormContent>
              <CreateProperty_Features_Section id="#features" />
            </CreationFormContent>
          </TabsContent>

          <TabsContent value="property-house-rules" className="w-full mt-4">
            <CreationFormContent>
              <PetsVisitorsSection id="#pets" />
              <CleanlinessSection id="#cleanliness" />
              <UtilitiesSection id="#utilities" />
              <SecuritySection id="#security" />
              <FamilyChildrenSection id="#family" />
              <FieldArraySection
                title="House Rules"
                description="Basic property rules and policies"
                // fields={methods.getValues("houseRules")}
                // append={methods.append}
                // remove={methods.remove}
                fields={[{ key: "", value: "" }]}
                append={() => { }}
                remove={() => { }}
                namePrefix="houseRules"
                placeholders={["Key", "Value"]}
              />
            </CreationFormContent>
          </TabsContent>
          <TabsContent value="property-house-policies" className="w-full mt-4">
            <CreationFormContent>
              <CreateProperty_HousePolicies_Section id="#policies" />
            </CreationFormContent>
          </TabsContent>

          <TabsContent value="property-house-settings" className="w-full mt-4">
            <CreationFormContent>
              <SearchParametersSection id="#search" />
            </CreationFormContent>
          </TabsContent>

          {/* Add additional <TabsContent> for billing, notifications, settings as needed */}
        </FormProvider>
      </Tabs>

      <CreationFormFooterActions>
        <Button variant="outline" disabled={isLoading} onClick={() => router.push("/properties")}>
          Cancel
        </Button>
        <Button type="submit" onClick={onSubmit} isLoading={isLoading}>
          Create Property
        </Button>
      </CreationFormFooterActions>
      {/* </form> */}

    </div >
  );
}
