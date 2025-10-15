import FloorInterface from "@/interfaces/floor.interface";
import RoomBedInterface from "@/interfaces/room-bed.interface";
import RoomCategoryInterface from "@/interfaces/room-category.interface";
import RoomFeatureInterface from "@/interfaces/room-feature.interface";
import RoomIncludesInterface from "@/interfaces/room-includes.interface";
import RoomTypeInterface from "@/interfaces/room-type.interface";
import {
  UpdateBedValidationSchema,
  UpdateRoomValidationSchemaType,
} from "./update-room-validation.schema";
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
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";
import UpdateRoom_MainInformation_Section from "./_components/main-info.section";
import UpdateRoom_Capacity_Section from "./_components/capacity.section";
import UpdateRoom_Features_Section from "./_components/features.section";
import UpdateRoom_Pricing_Section from "./_components/pricing.section";
import UpdateRoom_Floors_Section from "./_components/floors.section";
import UpdateRoom_Images_Section from "./_components/images.section";
import UpdateRoom_SEO_Section from "./_components/seo.section";
import toast from "react-hot-toast";
import { crud_check_floor_range } from "@/lib/curd/floors";
import { crud_is_room_code_taken, crud_update_room } from "@/lib/curd/room";
import { useRouter } from "@/i18n/routing";
import RoomInterface from "@/interfaces/room.interface";
import { generateSimpleId } from "@/lib/utils";
import { useHash } from "@mantine/hooks";
import { FileDetails } from "@/interfaces/file-manager";

interface Props {
  oldRoom: RoomInterface | null;
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
export default function UpdateRoomFrom({ formSelectData, oldRoom }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateRoomValidationSchemaType>({
    disabled: isLoading,
    resolver: zodResolver(UpdateBedValidationSchema),
    defaultValues: {
      description: "",
      seo_description: "",
      seo_slug: "",
      seo_title: "",
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

  useEffect(() => {
    // Set the old room data to the form
    if (oldRoom) {
      // main info
      methods.setValue("category", oldRoom.category.id);
      methods.setValue("old_name", oldRoom.title);
      methods.setValue("code", oldRoom.code);
      methods.setValue("description", oldRoom.description);
      // capacity
      methods.setValue("capacity_adults", oldRoom.capacity.adults);
      methods.setValue("capacity_children", oldRoom.capacity.children || 0);
      // size
      methods.setValue("size", oldRoom.size);
      // features
      methods.setValue(
        "features",
        oldRoom.features.map((f) => f.id)
      );
      methods.setValue(
        "beds",
        oldRoom.beds.map((f) => f.id)
      );
      methods.setValue(
        "includes",
        oldRoom.includes.map((f) => f.id)
      );
      methods.setValue(
        "types",
        oldRoom.types.map((f) => f.id)
      );
      methods.setValue(
        "extra_services",
        oldRoom.extra_services.map((f) => f.id)
      );
      // set the default price
      methods.setValue("default_price", oldRoom.default_price);
      // pricing
      methods.setValue(
        "old_price",
        oldRoom.price.map((p) => ({
          from: new Date(p.from) as Date,
          to: new Date(p.to) as Date,
          price: p.price,
          id: generateSimpleId(),
        }))
      );
      // floors
      methods.setValue(
        "old_floors",
        oldRoom.floors.map((f) => {
          const found = formSelectData.floors.find((e) => e.id == f.id)!;
          return {
            id: found.id,
            floor_free_space: found.free_space,
            floor_range: {
              end: found.range_end,
              start: found.range_start,
            },
            name: f.name,
            range_end: f.range_end,
            range_start: f.range_start,
          };
        })
      );

      // images
      methods.setValue(
        "main_image",
        (oldRoom.images_main as FileDetails)?.id || ""
      );
      methods.setValue(
        "gallery_images",
        (oldRoom?.images_gallery as any) ?? []
      );
      // seo
      methods.setValue("seo_title", oldRoom.seo.title);
      methods.setValue("seo_description", oldRoom.seo.description);
      methods.setValue("seo_old_keywords", oldRoom.seo.keywords);
      methods.setValue("seo_slug", oldRoom.seo.slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // scroll to top
    methods.setFocus("category", { shouldSelect: true });
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateRoomValidationSchemaType) => {
    if (!oldRoom) return;
    setIsLoading(true);

    // Check if the room code is taken
    if (oldRoom?.code && data.code !== oldRoom?.code) {
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
        console.error("Error: handleUpdate (update room) ===>", err);
        setIsLoading(false);
        return;
      }
    }

    // # First Checking The floors availability and range
    try {
      for (let i = 0; i < data.floors.length; i++) {
        const floor = data.floors[i];
        try {
          await crud_check_floor_range(
            floor.id,
            {
              range_end: floor.range_end,
              range_start: floor.range_start,
            },
            oldRoom?.id
          );
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
      if (err !== 409) toast.error("Something went wrong");
      setIsLoading(false);
      return;
    }
    const image_ids = data.gallery_images.map((image) => image.id);
    try {
      // update the room
      await crud_update_room(oldRoom?.id, {
        title: data.name,
        description: data.description,
        code: data.code,
        default_price: data.default_price,
        price: data.price as never,
        beds: data.beds,
        category: data.category,
        extra_services: data.extra_services,
        types: data.types,
        features: data.features,
        includes: data.includes,
        size: data.size,
        images_gallery: image_ids,
        images_main: data.main_image || "",
        capacity: {
          adults: data.capacity_adults,
          children: data.capacity_children,
        },
        seo: {
          description: data.seo_description,
          keywords: data.seo_keywords,
          slug: data.seo_slug,
          title: data.seo_title,
        },
        floors: data.floors.map((floor) => ({
          id: floor.id,
          range_end: floor.range_end,
          range_start: floor.range_start,
        })),
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
      });

      // to the rooms page
      router.push("/rooms");
      // tost
      toast.success("Room Updated Successfully");
    } catch (err) {
      console.error(
        "Error: handleUpdate (Check if the room code is taken) ===>",
        err
      );
      setIsLoading(false);

      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleUpdate)}>
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
              <UpdateRoom_MainInformation_Section
                categories={formSelectData.categories}
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* capacity section */}
              <UpdateRoom_Capacity_Section
                ref={section_capacity_ref}
                id="#capacity"
              />
              {/* features section */}
              <UpdateRoom_Features_Section
                extra_services={formSelectData.extra_services}
                beds={formSelectData.beds}
                features={formSelectData.features}
                includes={formSelectData.includes}
                types={formSelectData.types}
                id="#features"
                ref={section_features_ref}
              />
              {/* pricing section */}
              <UpdateRoom_Pricing_Section
                id="#pricing"
                ref={section_pricing_ref}
              />
              {/* floors section */}
              <UpdateRoom_Floors_Section
                floors={formSelectData.floors}
                id="#floors"
                ref={section_floors_ref}
              />
              {/* images section */}
              <UpdateRoom_Images_Section
                id="#images&photos"
                ref={section_images_ref}
              />
              {/* SEO section */}
              <UpdateRoom_SEO_Section id="#seo" ref={section_seo_ref} />
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
            {/* Save as draft */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Save Changes
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
