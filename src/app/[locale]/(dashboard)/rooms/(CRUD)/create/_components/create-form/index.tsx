import FloorInterface from "@/interfaces/floor.interface";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import RoomIncludesInterface from "@/interfaces/room-includes.interface";
import RoomTypeInterface from "@/interfaces/room-type.interface";
import {
  CreateRoomValidationSchema,
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
    resolver: zodResolver(CreateRoomValidationSchema),
    defaultValues: {
      description: "",
      accommodation: "",
      type: "",
      roomCode: "",
      bedsCount: 0,
      size: {
        value: 0,
        unit: "sqm",
      },
      bedroomsCount: 0,
      bedrooms: [],
      bathroomsCount: 0,
      sittingAreas: 0,
      kitchens: 0,
      extraBeds: 0,
      extraBedFee: 0,
      amenities: [],
      additionalFeatures: [],
      suitableFor: [],
      accessibleRoom: false,
      connectingRooms: false,
      balcony: false,
      configuration: "",
      rateCode: "",
      frequentlyBoughtTogether: [],
      // For policies, if they are flattened in your form state:
      policies: {
        smokingArea: false,
        petsAllowed: false,
        damageFees: [],
        dipositFees: [],
        minimumNightStay: 1, // Assuming a default of 1 for policies
        includes: [],
        guidlines: [],
        restrictions: [],
      },
      // ⭐ The rooms array itself is part of the floors, so we initialize floors here
      floors: [],
    },
  });

  // Add this line to log the form errors
  const { errors } = methods.formState;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors:", errors);
    }
  }, [errors]);

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
    // methods.setFocus("category", { shouldSelect: true });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⭐ New handler to update a specific room within the floors array
  const handleUpdateRoom = (
    floorId: string,
    sectionId: string,
    roomId: string,
    updates: Partial<any> // Use any or a more specific Room type if available
  ) => {
    // Get the current value of the floors array
    const currentFloors = methods.getValues("floors");

    // Find the floor to update
    const newFloors = currentFloors.map(floor => {
      if (floor.id === floorId) {
        // Find the room to update within this floor's rooms array
        const newRooms = floor.rooms.map(room => {
          if (room.id === roomId) {
            return { ...room, ...updates };
          }
          return room;
        });
        return { ...floor, rooms: newRooms };
      }
      return floor;
    });

    // Update the form state with the new floors array
    methods.setValue("floors", newFloors, { shouldDirty: true });
  };
  
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
      const is_taken = await crud_is_room_code_taken(data.roomCode);
      if (is_taken) {
        // setting
        methods.setError("roomCode", {
          type: "validate",
          message: "Room code is already used ,try other",
        });
        // scroll to the code input
        methods.setFocus("roomCode");
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

    console.log("Data before creating room:", data);

    try {
      // Assuming 'data' object contains all the necessary fields from your form
      await crud_create_room({
        propertyCode: data.propertyCode || '',
        propertyName: selectedPropertyDetails?.propertyName || '',
        accommodation: data.accommodation || '',
        type: data.type || '',
        roomCode: data.roomCode,
        description: data.description || '',
        size: {
          value: data.size.value,
          unit: data.size.unit || 'sqm',
        },
        capacity: {
          adults: data.capacity.adults || 0,
          children: data.capacity.children || 0
        },
        bedsCount: data.bedsCount,
        bedroomsCount: data.bedroomsCount,
        bedrooms: data.bedrooms || [],
        bathroomsCount: data.bathroomsCount || 0,
        sittingAreas: data.sittingAreas || 0,
        kitchens: data.kitchens || 0,
        extraBeds: data.extraBeds || 0,
        extraBedFee: data.extraBedFee || 0,
        amenities: data.amenities || [],
        additionalFeatures: data.additionalFeatures || [],
        suitableFor: data.suitableFor || [],
        accessibleRoom: data.accessibleRoom || false,
        connectingRooms: data.connectingRooms || false,
        balcony: data.balcony || false,
        configuration: data.configuration || '',
        rateCode: data.rateCode || '',
        // ⭐ Add the roomPricing array here, ensuring 'views' is an array if defined, else undefined
        roomPricing: data.roomPricing.map(price => ({
          type: price.type,
          views: price.views?.length ? price.views : undefined, // Ensure views matches the SavedPricingRow type for output
          smoking: price.smoking,
          petFriendly: price.petFriendly,
          rateCode: price.rateCode,
        })),
        frequentlyBoughtTogether: data.frequentlyBoughtTogether || [],
        policies: {
          smokingArea: data.policies.smokingArea || false,
          petsAllowed: data.policies.petsAllowed || false,
          damageFees: data.policies.damageFees || [],
          dipositFees: data.policies.dipositFees || [],
          minimumNightStay: data.policies.minimumNightStay || 1,
          includes: data.policies.includes?.map(item => ({
            title: item.title || '',
            description: item.description || '',
          })) || [],
          guidlines: data.policies.guidlines?.map(item => ({
            title: item.title || '',
            description: item.description || '',
          })) || [],
          restrictions: data.policies.restrictions?.map(item => ({
            title: item.title || '',
            description: item.description || '',
          })) || [],
        },
        seo: {
          description: data.seo.description || '',
          title: data.seo.title || '',
          keywords: data.seo.keywords || [],
          slug: data.seo.slug || '',
        },
        // ⭐ Now we can send the floors data, including the rooms with all their new fields
        floors: data.floors,
      });

      // Resetting the form after successful submission
      methods.reset({
        propertyCode: '',
        propertyName: '',
        accommodation: '',
        type: '',
        roomCode: '',
        description: '',
        size: {
          value: 0,
          unit: 'sqm',
        },
        bedsCount: 0,
        bedroomsCount: 0,
        bedrooms: [],
        bathroomsCount: 0,
        sittingAreas: 0,
        kitchens: 0,
        extraBeds: 0,
        extraBedFee: 0,
        amenities: [],
        additionalFeatures: [],
        suitableFor: [],
        accessibleRoom: false,
        connectingRooms: false,
        balcony: false,
        configuration: '',
        rateCode: '',
        // ⭐ Add the roomPricing array here for resetting
        roomPricing: [], // Reset to an empty array
        frequentlyBoughtTogether: [],
        policies: {
          smokingArea: false,
          petsAllowed: false,
          damageFees: [],
          dipositFees: [],
          minimumNightStay: 1,
          includes: [],
          guidlines: [],
          restrictions: [],
        },
        seo: {
          description: '',
          title: '',
          keywords: [],
          slug: '',
        },
        // ⭐ Reset the floors array as well
        floors: [],
      });


      setSelectedPropertyDetails(null); // Reset selected property details

      // Navigate to the rooms page
      router.push("/rooms");
      // Show success toast
      toast.success("Room Created Successfully");
    } catch (err) {
      console.error("Error: handleCreate ===>", err);
      setIsLoading(false); // Ensure loading state is reset on error

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
              {/* <CreateRoom_Images_Section
                id="#images&photos"
                ref={section_images_ref}
              /> */}
              {/* capacity section */}
              <CreateRoom_Capacity_Section
                ref={section_capacity_ref}
                id="#capacity"
              />
              {/* features section */}
              <CreateRoom_Features_Section
                // extra_services={[]}
                amenities_options={[]}
                views_options={[]}
                id="#features"
                ref={section_features_ref}
              />
              {/* ADDED: ref and id for Rate & Bundles */}
              <CreateRoom_RateAndBundles_Section
                selectedPropertyDetails={selectedPropertyDetails}
                id="#rate-and-bundles"
                ref={section_rate_bundles_ref}
                frequently_bought_options={frequentlyBoughtData}
                rate_code_options={rateCodeData}
              />
              {/* ADDED: ref and id for Policies & Restrictions */}
              <CreateRoom_PoliciesAndRestrictions_Section
                selectedPropertyDetails={selectedPropertyDetails} // <-- Pass the selected property details
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
                id="#floors"
                ref={section_floors_ref}
                // selectedPropertyDetails={selectedPropertyDetails}
                selectedPropertyDetails={selectedPropertyDetails} // <-- Pass the selected property details to the floors section
                // ⭐ Pass the new update handler to the floors section
                onUpdateRoom={handleUpdateRoom}
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


// import FloorInterface from "@/interfaces/floor.interface";
// import RoomBedInterface from "@/interfaces/room-bed.interface";
// import RoomCategoryInterface from "@/interfaces/room-category.interface";
// import RoomFeatureInterface from "@/interfaces/room-feature.interface";
// import RoomIncludesInterface from "@/interfaces/room-includes.interface";
// import RoomTypeInterface from "@/interfaces/room-type.interface";
// import {
//   CreateRoomValidationSchema,
//   CreateRoomValidationSchemaType,
// } from "./create-room-validation.schema";
// import { FormProvider, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useEffect, useRef, useState } from "react";
// import {
//   CreationTabsContent,
//   CreationTabsTab,
// } from "@/components/creation-tabs";
// import {
//   CreationFormContent,
//   CreationFormFooterActions,
// } from "@/components/creation-form";
// import { Button } from "@/components/ui/button";
// import CreateRoom_MainInformation_Section from "./_components/main-info.section";
// import CreateRoom_Capacity_Section from "./_components/capacity.section";
// import CreateRoom_Features_Section from "./_components/features.section";
// import RoomExtraServiceInterface from "@/interfaces/room-extra-services";
// import CreateRoom_Pricing_Section from "./_components/pricing.section";
// import CreateRoom_Floors_Section from "./_components/floors.section";
// import CreateRoom_Images_Section from "./_components/images.section";
// import CreateRoom_SEO_Section from "./_components/seo.section";
// import toast from "react-hot-toast";
// import { crud_check_floor_range } from "@/lib/curd/floors";
// import { crud_create_room, crud_is_room_code_taken } from "@/lib/curd/room";
// import { useRouter } from "@/i18n/routing";
// import { useHash } from "@mantine/hooks";
// import CreateRoom_RateAndBundles_Section from "./_components/rate-and-bundle.section";
// import CreateRoom_PoliciesAndRestrictions_Section from "./_components/policies-and-restrictions.section";
// // Import PropertyInterface if not already imported (you used it in child, but not here directly yet)
// import PropertyInterface from "@/interfaces/property.interface"; // <-- ADD THIS IMPORT

// interface Props {
//   formSelectData: {
//     features: RoomFeatureInterface[];
//     includes: RoomIncludesInterface[];
//     types: RoomTypeInterface[];
//     categories: RoomCategoryInterface[];
//     beds: RoomBedInterface[];
//     extra_services: RoomExtraServiceInterface[];
//     floors: FloorInterface[];
//   };
// }
// export default function CreateRoomFrom({ formSelectData }: Props) {
//   // loading
//   const [isLoading, setIsLoading] = useState(false);

//   // --- NEW STATE TO STORE SELECTED PROPERTY DETAILS ---
//   const [selectedPropertyDetails, setSelectedPropertyDetails] =
//     useState<PropertyInterface | null>(null);
//   // You can now access `selectedPropertyDetails` anywhere in this component.
//   // For example, you might log it or use parts of it for display/other logic.
//   useEffect(() => {
//     console.log("Selected Property Details updated in parent:", selectedPropertyDetails);
//     // You can perform other actions here, like setting another form field,
//     // or enabling/disabling parts of the form based on property details.
//   }, [selectedPropertyDetails]);

//   // form
//   const methods = useForm<CreateRoomValidationSchemaType>({
//     disabled: isLoading,
//     resolver: zodResolver(CreateRoomValidationSchema),
//     defaultValues: {
//       description: "",
//       accommodation: "",
//       type: "",
//       roomCode: "",
//       bedsCount: 0,
//       size: {
//         value: 0,
//         unit: "sqm",
//       },
//       bedroomsCount: 0,
//       bedrooms: [],
//       bathroomsCount: 0,
//       sittingAreas: 0,
//       kitchens: 0,
//       extraBeds: 0,
//       extraBedFee: 0,
//       amenities: [],
//       additionalFeatures: [],
//       suitableFor: [],
//       accessibleRoom: false,
//       connectingRooms: false,
//       balcony: false,
//       configuration: "",
//       rateCode: "",
//       frequentlyBoughtTogether: [],
//       // For policies, if they are flattened in your form state:
//       policies: {
//         smokingArea: false,
//         petsAllowed: false,
//         damageFees: [],
//         dipositFees: [],
//         minimumNightStay: 1, // Assuming a default of 1 for policies
//         includes: [],
//         guidlines: [],
//         restrictions: [],
//       },


//     },
//   });

//   // Add this line to log the form errors
//   const { errors } = methods.formState;
//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       console.log("Form validation errors:", errors);
//     }
//   }, [errors]);

//   // router
//   const router = useRouter();
//   // hash
//   const [hash] = useHash();

//   // sections refs
//   const section_main_info_ref = useRef<HTMLDivElement>(null);
//   const section_capacity_ref = useRef<HTMLDivElement>(null);
//   const section_features_ref = useRef<HTMLDivElement>(null);
//   const section_pricing_ref = useRef<HTMLDivElement>(null);
//   const section_floors_ref = useRef<HTMLDivElement>(null);
//   const section_images_ref = useRef<HTMLDivElement>(null);
//   const section_seo_ref = useRef<HTMLDivElement>(null);
//   const section_rate_bundles_ref = useRef<HTMLDivElement>(null); // ADDED
//   const section_policies_ref = useRef<HTMLDivElement>(null); // ADDED

//   useEffect(() => {
//     // scroll to top
//     // methods.setFocus("category", { shouldSelect: true });
//     window.scrollTo({ top: 0 });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   // handle create
//   const handleCreate = async (data: CreateRoomValidationSchemaType) => {
//     setIsLoading(true);

//     // Now, `selectedPropertyDetails` will contain the full object of the selected property
//     // if the user has chosen one. `data.property` will contain just the ID.
//     // You can use `selectedPropertyDetails` here if you need more than just the ID.
//     console.log("Creating room with data:", data);
//     console.log("Selected Property Full Details:", selectedPropertyDetails);

//     // Check if the room code is taken
//     try {
//       const is_taken = await crud_is_room_code_taken(data.roomCode);
//       if (is_taken) {
//         // setting
//         methods.setError("roomCode", {
//           type: "validate",
//           message: "Room code is already used ,try other",
//         });
//         // scroll to the code input
//         methods.setFocus("roomCode");
//         section_main_info_ref.current?.scrollIntoView({
//           block: "center",
//           behavior: "smooth",
//         });
//         setIsLoading(false);
//         return;
//       }
//     } catch (err) {
//       console.error(
//         "Error: handleCreate (Check if the room code is taken) ===>",
//         err
//       );
//       setIsLoading(false);
//       return;
//     }

//     // # First Checking The floors availability and range
//     // try {
//     //   for (let i = 0; i < data.floors.length; i++) {
//     //     const floor = data.floors[i];
//     //     try {
//     //       await crud_check_floor_range(floor.id, {
//     //         range_end: floor.range_end,
//     //         range_start: floor.range_start,
//     //       });
//     //     } catch (err) {
//     //       if (err == 409) {
//     //         methods.setError("floors", {
//     //           message: `This room has a range conflict with other room in ${floor.name} floor`,
//     //           type: "value",
//     //         });
//     //         // methods.setFocus("floors");
//     //         section_floors_ref.current?.scrollIntoView({
//     //           block: "center",
//     //           behavior: "smooth",
//     //         });
//     //       }
//     //       throw err;
//     //     }
//     //   }
//     // } catch (err: any) {
//     //   console.error(
//     //     "Error: handleCreate (Checking The floors availability and range) ===>",
//     //     err
//     //   );
//     //   if (err !== 409) toast.error("Something went wrong");
//     //   setIsLoading(false);
//     //   return;
//     // }
//     console.log("Data before creating room:", data);

//     try {
//       // Assuming 'data' object contains all the necessary fields from your form
//       await crud_create_room({
//         propertyCode: data.propertyCode || '',
//         propertyName: selectedPropertyDetails?.propertyName || '',
//         accommodation: data.accommodation || '',
//         type: data.type || '',
//         roomCode: data.roomCode,
//         description: data.description || '',
//         size: {
//           value: data.size.value,
//           unit: data.size.unit || 'sqm',
//         },
//         capacity: {
//           adults: data.capacity.adults || 0,
//           children: data.capacity.children || 0
//         },
//         bedsCount: data.bedsCount,
//         bedroomsCount: data.bedroomsCount,
//         bedrooms: data.bedrooms || [],
//         bathroomsCount: data.bathroomsCount || 0,
//         sittingAreas: data.sittingAreas || 0,
//         kitchens: data.kitchens || 0,
//         extraBeds: data.extraBeds || 0,
//         extraBedFee: data.extraBedFee || 0,
//         amenities: data.amenities || [],
//         additionalFeatures: data.additionalFeatures || [],
//         suitableFor: data.suitableFor || [],
//         accessibleRoom: data.accessibleRoom || false,
//         connectingRooms: data.connectingRooms || false,
//         balcony: data.balcony || false,
//         configuration: data.configuration || '',
//         rateCode: data.rateCode || '',
//         // ⭐ Add the roomPricing array here, ensuring 'views' is an array if defined, else undefined
//         roomPricing: data.roomPricing.map(price => ({
//           type: price.type,
//           views: price.views?.length ? price.views : undefined, // Ensure views matches the SavedPricingRow type for output
//           smoking: price.smoking,
//           petFriendly: price.petFriendly,
//           rateCode: price.rateCode,
//         })),
//         frequentlyBoughtTogether: data.frequentlyBoughtTogether || [],
//         policies: {
//           smokingArea: data.policies.smokingArea || false,
//           petsAllowed: data.policies.petsAllowed || false,
//           damageFees: data.policies.damageFees || [],
//           dipositFees: data.policies.dipositFees || [],
//           minimumNightStay: data.policies.minimumNightStay || 1,
//           includes: data.policies.includes?.map(item => ({
//             title: item.title || '',
//             description: item.description || '',
//           })) || [],
//           guidlines: data.policies.guidlines?.map(item => ({
//             title: item.title || '',
//             description: item.description || '',
//           })) || [],
//           restrictions: data.policies.restrictions?.map(item => ({
//             title: item.title || '',
//             description: item.description || '',
//           })) || [],
//         },
//         seo: {
//           description: data.seo.description || '',
//           title: data.seo.title || '',
//           keywords: data.seo.keywords || [],
//           slug: data.seo.slug || '',
//         }
//       });

//       // Resetting the form after successful submission
//       methods.reset({
//         propertyCode: '',
//         propertyName: '',
//         accommodation: '',
//         type: '',
//         roomCode: '',
//         description: '',
//         size: {
//           value: 0,
//           unit: 'sqm',
//         },
//         bedsCount: 0,
//         bedroomsCount: 0,
//         bedrooms: [],
//         bathroomsCount: 0,
//         sittingAreas: 0,
//         kitchens: 0,
//         extraBeds: 0,
//         extraBedFee: 0,
//         amenities: [],
//         additionalFeatures: [],
//         suitableFor: [],
//         accessibleRoom: false,
//         connectingRooms: false,
//         balcony: false,
//         configuration: '',
//         rateCode: '',
//         // ⭐ Add the roomPricing array here for resetting
//         roomPricing: [], // Reset to an empty array
//         frequentlyBoughtTogether: [],
//         policies: {
//           smokingArea: false,
//           petsAllowed: false,
//           damageFees: [],
//           dipositFees: [],
//           minimumNightStay: 1,
//           includes: [],
//           guidlines: [],
//           restrictions: [],
//         },
//         seo: {
//           description: '',
//           title: '',
//           keywords: [],
//           slug: '',
//         }
//       });


//       setSelectedPropertyDetails(null); // Reset selected property details

//       // Navigate to the rooms page
//       router.push("/rooms");
//       // Show success toast
//       toast.success("Room Created Successfully");
//     } catch (err) {
//       console.error("Error: handleCreate ===>", err);
//       setIsLoading(false); // Ensure loading state is reset on error

//       toast.error("Something went wrong");
//       return;
//     }

//     setIsLoading(false);
//   };
//   const rateCodeData = [
//     { id: "STD", name: "Standard Rate" },
//     { id: "AP", name: "Advance Purchase" },
//     { id: "CORP", name: "Corporate Deal" },
//   ];
//   const frequentlyBoughtData = [
//     { label: "Breakfast Buffet", value: "breakfast" },
//     { label: "Airport Transfer", value: "airport_transfer" },
//     { label: "Late Check-out", value: "late_checkout" },
//     { label: "Spa Credit", value: "spa_credit" },
//   ];


//   return (
//     <div className="relative">
//       <form onSubmit={methods.handleSubmit(handleCreate)}>
//         <div className="w-full  min-h-screen">
//           {/* header */}
//           <CreationTabsContent>
//             <CreationTabsTab
//               hash="#main-information"
//               selected={hash == "#main-information"}
//               ref={section_main_info_ref}
//             >
//               Main Information
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#capacity"
//               selected={hash == "#capacity"}
//               ref={section_capacity_ref}
//             >
//               Capacity
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#features"
//               selected={hash == "#features"}
//               ref={section_features_ref}
//             >
//               Features
//             </CreationTabsTab>
//             {/* ADDED: Rate & Bundles Tab */}
//             <CreationTabsTab
//               hash="#rate-and-bundles"
//               selected={hash == "#rate-and-bundles"}
//               ref={section_rate_bundles_ref}
//             >
//               Rate & Bundles
//             </CreationTabsTab>
//             {/* ADDED: Policies & Restrictions Tab */}
//             <CreationTabsTab
//               hash="#policies-and-restrictions"
//               selected={hash == "#policies-and-restrictions"}
//               ref={section_policies_ref}
//             >
//               Policies & Restrictions
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#pricing"
//               selected={hash == "#pricing"}
//               ref={section_pricing_ref}
//             >
//               Pricing
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#floors"
//               selected={hash == "#floors"}
//               ref={section_floors_ref}
//             >
//               Floors
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#images&photos"
//               selected={hash == "#images&photos"}
//               ref={section_images_ref}
//             >
//               Image & Photos
//             </CreationTabsTab>
//             <CreationTabsTab
//               hash="#seo"
//               selected={hash == "#seo"}
//               ref={section_seo_ref}
//             >
//               SEO
//             </CreationTabsTab>
//           </CreationTabsContent>

//           <FormProvider {...methods}>
//             <CreationFormContent>
//               {/* main info section */}
//               <CreateRoom_MainInformation_Section
//                 categories={formSelectData.categories}
//                 ref={section_main_info_ref}
//                 id="#main-information"
//                 // --- NEW PROP: Pass the callback to the child ---
//                 onPropertySelect={setSelectedPropertyDetails}
//               />
//               {/* images section */}
//               {/* <CreateRoom_Images_Section
//                 id="#images&photos"
//                 ref={section_images_ref}
//               /> */}
//               {/* capacity section */}
//               <CreateRoom_Capacity_Section
//                 ref={section_capacity_ref}
//                 id="#capacity"
//               />
//               {/* features section */}
//               <CreateRoom_Features_Section
//                 // extra_services={[]}
//                 amenities_options={[]}
//                 views_options={[]}
//                 id="#features"
//                 ref={section_features_ref}
//               />
//               {/* ADDED: ref and id for Rate & Bundles */}
//               <CreateRoom_RateAndBundles_Section
//                 selectedPropertyDetails={selectedPropertyDetails}
//                 id="#rate-and-bundles"
//                 ref={section_rate_bundles_ref}
//                 frequently_bought_options={frequentlyBoughtData}
//                 rate_code_options={rateCodeData}
//               />
//               {/* ADDED: ref and id for Policies & Restrictions */}
//               <CreateRoom_PoliciesAndRestrictions_Section
//                 selectedPropertyDetails={selectedPropertyDetails} // <-- Pass the selected property details
//                 damage_fee_options={[]}
//                 deposit_fee_options={[]}
//                 id="#policies-and-restrictions"
//                 ref={section_policies_ref}
//               />
//               {/* // pricing section
//               <CreateRoom_Pricing_Section
//                 id="#pricing"
//                 ref={section_pricing_ref}
//               /> */}
//               {/* floors section */}
//               <CreateRoom_Floors_Section
//                 id="#floors"
//                 ref={section_floors_ref}
//                 // selectedPropertyDetails={selectedPropertyDetails}
//                 selectedPropertyDetails={selectedPropertyDetails} // <-- Pass the selected property details to the floors section
//               />

//               {/* SEO section */}
//               <CreateRoom_SEO_Section id="#seo" ref={section_seo_ref} />
//               <div className="mb-[5em]"></div>
//             </CreationFormContent>
//           </FormProvider>
//         </div>
//         <CreationFormFooterActions>
//           <Button
//             onClick={() => router.push("/rooms")}
//             disabled={isLoading}
//             type="button"
//             variant="outline"
//           >
//             Cancel
//           </Button>
//           <Button disabled={isLoading} isLoading={isLoading} type="submit">
//             Create Room
//           </Button>
//         </CreationFormFooterActions>
//       </form>
//     </div>
//   );
// }