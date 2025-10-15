import FloorInterface from "@/interfaces/floor.interface";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import RoomIncludesInterface from "@/interfaces/room-includes.interface";
import RoomTypeInterface from "@/interfaces/room-type.interface";
import {
  CreateBedValidationSchema,
  CreateRoomValidationSchemaType,
} from "./create-room-validation.schema";
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
import CreateRoom_MainInformation_Section from "./_components/main-info.section";
import CreateRoom_Capacity_Section from "./_components/capacity.section";
import CreateRoom_Features_Section from "./_components/features.section";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";
import CreateRoom_Pricing_Section from "./_components/pricing.section";
import CreateRoom_Floors_Section from "./_components/floors.section";
import CreateRoom_Images_Section from "./_components/images.section";
import CreateRoom_SEO_Section from "./_components/seo.section";
import toast from "react-hot-toast";
import { crud_check_floor_range } from "@/lib/curd/floors";
import { crud_create_room, crud_is_room_code_taken } from "@/lib/curd/room";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import CreateRoom_RateAndBundles_Section from "./_components/rate-and-bundle.section";
import CreateRoom_PoliciesAndRestrictions_Section from "./_components/policies-and-restrictions.section";
// Import PropertyInterface if not already imported (you used it in child, but not here directly yet)
import PropertyInterface from "@/interfaces/property.interface"; // <-- ADD THIS IMPORT

interface Props {
  formSelectData: {
    features: RoomFeatureInterface[];
    includes: RoomIncludesInterface[];
    types: RoomTypeInterface[];
    categories: RoomCategoryInterface[];
    beds: RoomBedInterface[];
    extra_services: RoomExtraServiceInterface[];
    floors: FloorInterface[];
  };
}
export default function CreateRoomFrom({ formSelectData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW STATE TO STORE SELECTED PROPERTY DETAILS ---
  const [selectedPropertyDetails, setSelectedPropertyDetails] =
    useState<PropertyInterface | null>(null);
  // You can now access `selectedPropertyDetails` anywhere in this component.
  // For example, you might log it or use parts of it for display/other logic.
  useEffect(() => {
    console.log("Selected Property Details updated in parent:", selectedPropertyDetails);
    // You can perform other actions here, like setting another form field,
    // or enabling/disabling parts of the form based on property details.
  }, [selectedPropertyDetails]);


  // form
  const methods = useForm<CreateRoomValidationSchemaType>({
    disabled: isLoading,
    resolver: zodResolver(CreateBedValidationSchema),
    defaultValues: {
      description: "",
      seo_description: "",
      seo_slug: "",
      seo_title: "",
      main_image: "",
      // Ensure 'property' field is initialized as well if it's part of your schema
      property: "", // Assuming this is where the property ID is stored
      propertyCode: "", // Assuming this is where the search input is stored
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_capacity_ref = useRef<HTMLDivElement>(null);
  const section_features_ref = useRef<HTMLDivElement>(null);
  const section_pricing_ref = useRef<HTMLDivElement>(null);
  const section_floors_ref = useRef<HTMLDivElement>(null);
  const section_images_ref = useRef<HTMLDivElement>(null);
  const section_seo_ref = useRef<HTMLDivElement>(null);
  const section_rate_bundles_ref = useRef<HTMLDivElement>(null); // ADDED
  const section_policies_ref = useRef<HTMLDivElement>(null); // ADDED

  useEffect(() => {
    // scroll to top
    methods.setFocus("category", { shouldSelect: true });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // handle create
  const handleCreate = async (data: CreateRoomValidationSchemaType) => {
    setIsLoading(true);

    // Now, `selectedPropertyDetails` will contain the full object of the selected property
    // if the user has chosen one. `data.property` will contain just the ID.
    // You can use `selectedPropertyDetails` here if you need more than just the ID.
    console.log("Creating room with data:", data);
    console.log("Selected Property Full Details:", selectedPropertyDetails);

    // Check if the room code is taken
    try {
      const is_taken = await crud_is_room_code_taken(data.code);
      if (is_taken) {
        // setting
        methods.setError("code", {
          type: "validate",
          message: "Room code is already used ,try other",
        });
        // scroll to the code input
        methods.setFocus("code");
        section_main_info_ref.current?.scrollIntoView({
          block: "center",
          behavior: "smooth",
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error(
        "Error: handleCreate (Check if the room code is taken) ===>",
        err
      );
      setIsLoading(false);
      return;
    }

    // # First Checking The floors availability and range
    try {
      for (let i = 0; i < data.floors.length; i++) {
        const floor = data.floors[i];
        try {
          await crud_check_floor_range(floor.id, {
            range_end: floor.range_end,
            range_start: floor.range_start,
          });
        } catch (err) {
          if (err == 409) {
            methods.setError("floors", {
              message: `This room has a range conflict with other room in ${floor.name} floor`,
              type: "value",
            });
            // methods.setFocus("floors");
            section_floors_ref.current?.scrollIntoView({
              block: "center",
              behavior: "smooth",
            });
          }
          throw err;
        }
      }
    } catch (err: any) {
      console.error(
        "Error: handleCreate (Checking The floors availability and range) ===>",
        err
      );
      if (err !== 409) toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }

    try {
      const image_ids = data.gallery_images.map((image) => image.id);
      // create the room
      await crud_create_room({
        propertyCode: data.propertyCode || '', // This is the search input value
        propertyName: selectedPropertyDetails?.propertyName || '',
        name: data.name,
        
        title: data.name,
        description: data.description || "",
        code: data.code,
        price: data.price as any,
        beds: data.beds,
        category: data.category,
        extra_services: data.extra_services,
        types: data.types,
        features: data.features,
        includes: data.includes,
        size: data.size,
        default_price: data.default_price,
        images_gallery: image_ids,
        images_main: data.main_image || "",
        capacity: {
          adults: data.capacity_adults,
          children: data.capacity_children,
        },
        seo: {
          description: data.seo_description || "",
          keywords: data.seo_keywords,
          slug: data.seo_slug || "",
          title: data.seo_title || "",
        },
        floors: data.floors.map((floor) => ({
          id: floor.id,
          range_end: floor.range_end,
          range_start: floor.range_start,
        })),
        // If your room creation DTO needs the full property object or other fields from it,
        // you would add them here. Otherwise, `data.property` (the ID) is usually sufficient.
        // For example, if you need the property's name or city:
        // propertyName: selectedPropertyDetails?.propertyName,
        // propertyCity: selectedPropertyDetails?.city,
        property: data.property, // This is the ID of the selected property
      });

      // resetting the form
      methods.reset({
        beds: [],
        capacity_adults: 0,
        capacity_children: 0,
        category: "",
        code: "",
        description: "",
        extra_services: [],
        features: [],
        floors: [],
        gallery_images: [],
        main_image: "",
        includes: [],
        name: "",
        price: [],
        seo_description: "",
        seo_keywords: [],
        seo_slug: "",
        seo_title: "",
        types: [],
        property: "", // Reset the property ID as well
        propertyCode: "", // Reset the search input as well
      });
      setSelectedPropertyDetails(null); // <-- Reset selected property details

      // to the rooms page
      router.push("/rooms");
      // tost
      toast.success("Room Created Successfully");
    } catch (err) {
      console.error("Error: handleCreate ===>", err);
      setIsLoading(false);

      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };
  const rateCodeData = [
    { id: "STD", name: "Standard Rate" },
    { id: "AP", name: "Advance Purchase" },
    { id: "CORP", name: "Corporate Deal" },
  ];
  const frequentlyBoughtData = [
    { label: "Breakfast Buffet", value: "breakfast" },
    { label: "Airport Transfer", value: "airport_transfer" },
    { label: "Late Check-out", value: "late_checkout" },
    { label: "Spa Credit", value: "spa_credit" },
  ];


  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
        <div className="w-full  min-h-screen">
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
              hash="#capacity"
              selected={hash == "#capacity"}
              ref={section_capacity_ref}
            >
              Capacity
            </CreationTabsTab>
            <CreationTabsTab
              hash="#features"
              selected={hash == "#features"}
              ref={section_features_ref}
            >
              Features
            </CreationTabsTab>
            {/* ADDED: Rate & Bundles Tab */}
            <CreationTabsTab
              hash="#rate-and-bundles"
              selected={hash == "#rate-and-bundles"}
              ref={section_rate_bundles_ref}
            >
              Rate & Bundles
            </CreationTabsTab>
            {/* ADDED: Policies & Restrictions Tab */}
            <CreationTabsTab
              hash="#policies-and-restrictions"
              selected={hash == "#policies-and-restrictions"}
              ref={section_policies_ref}
            >
              Policies & Restrictions
            </CreationTabsTab>
            <CreationTabsTab
              hash="#pricing"
              selected={hash == "#pricing"}
              ref={section_pricing_ref}
            >
              Pricing
            </CreationTabsTab>
            <CreationTabsTab
              hash="#floors"
              selected={hash == "#floors"}
              ref={section_floors_ref}
            >
              Floors
            </CreationTabsTab>
            <CreationTabsTab
              hash="#images&photos"
              selected={hash == "#images&photos"}
              ref={section_images_ref}
            >
              Image & Photos
            </CreationTabsTab>
            <CreationTabsTab
              hash="#seo"
              selected={hash == "#seo"}
              ref={section_seo_ref}
            >
              SEO
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <CreateRoom_MainInformation_Section
                categories={formSelectData.categories}
                ref={section_main_info_ref}
                id="#main-information"
                // --- NEW PROP: Pass the callback to the child ---
                onPropertySelect={setSelectedPropertyDetails}
              />
              {/* images section */}
              <CreateRoom_Images_Section
                id="#images&photos"
                ref={section_images_ref}
              />
              {/* capacity section */}
              <CreateRoom_Capacity_Section
                ref={section_capacity_ref}
                id="#capacity"
              />
              {/* features section */}
              <CreateRoom_Features_Section
                extra_services={[]}
               amenities_options={[]}
                views_options={[]}
                id="#features"
                ref={section_features_ref}
              />
              {/* ADDED: ref and id for Rate & Bundles */}
              <CreateRoom_RateAndBundles_Section
                id="#rate-and-bundles"
                ref={section_rate_bundles_ref}
                frequently_bought_options={frequentlyBoughtData}
                rate_code_options={rateCodeData}
              />
              {/* ADDED: ref and id for Policies & Restrictions */}
              <CreateRoom_PoliciesAndRestrictions_Section
                damage_fee_options={[]}
                deposit_fee_options={[]}
                id="#policies-and-restrictions"
                ref={section_policies_ref}
              />
              {/* // pricing section
              <CreateRoom_Pricing_Section
                id="#pricing"
                ref={section_pricing_ref}
              /> */}
              {/* floors section */}
              <CreateRoom_Floors_Section
                floors={formSelectData.floors}
                id="#floors"
                ref={section_floors_ref}
                selectedPropertyDetails={selectedPropertyDetails}
              />
              
              {/* SEO section */}
              <CreateRoom_SEO_Section id="#seo" ref={section_seo_ref} />
              <div className="mb-[5em]"></div>
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/rooms")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create Room
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}