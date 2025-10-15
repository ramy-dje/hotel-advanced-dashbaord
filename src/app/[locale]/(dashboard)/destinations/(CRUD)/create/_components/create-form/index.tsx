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
  CreateDestinationValidationSchema,
  CreateDestinationValidationSchemaType,
} from "./create-destination-validation.schema";
import { UploadFile, UploadManyFiles } from "@/lib/storage";
import CreateDestination_MainInformation_Section from "./components/main-info.section";
import CreateDestination_HeaderInfo_Section from "./components/header-info.section";
import CreateDestination_Images_Section from "./components/images.section";
import CreateDestination_Content_Section from "./components/content.section";
import CreateDestination_SEO_Section from "./components/seo.section";
import { crud_create_destination } from "@/lib/curd/destination";

export default function CreateDestinationFrom() {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateDestinationValidationSchemaType>({
    resolver: zodResolver(CreateDestinationValidationSchema),
    defaultValues: {
      features: [],
      main_image: null,
      distance: 5,
      seo_keywords: [],
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_header_info_ref = useRef<HTMLDivElement>(null);
  const section_images_ref = useRef<HTMLDivElement>(null);
  const section_content_ref = useRef<HTMLDivElement>(null);
  const section_seo_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("header_title");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset(
      {},
      {
        keepDefaultValues: true,
      }
    );
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateDestinationValidationSchemaType) => {
    setIsLoading(true);
    try {
      // Upload the main Image
      let main_image_public_url: string = "";

      if (data.main_image) {
        // uploading the main image
        const public_url = await UploadFile(
          data.main_image,
          "destination-image"
        );
        if (public_url) {
          main_image_public_url = public_url;
        }
      }

      // uploading the gallery images
      const public_urls = await UploadManyFiles(
        data.gallery_images,
        "destination-image"
      );

      // create the room
      await crud_create_destination({
        title: data.title,
        content: data.content,
        header: {
          sub_title: data.header_sub_title,
          title: data.header_title,
          description: data.header_description,
        },
        distance: Number(data.distance),
        features: data.features,
        images_gallery: public_urls,
        sub_title: data.sub_title,
        image: main_image_public_url as string,
        seo: {
          description: data.seo_description,
          keywords: data.seo_keywords,
          slug: data.seo_slug,
          title: data.seo_title,
        },
      });
      // to the blogs page
      router.push("/destinations");
      // tost
      toast.success("Destination Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
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
              hash="#caption-information"
              selected={hash == "#caption-information"}
              ref={section_header_info_ref}
            >
              Caption Information
            </CreationTabsTab>
            <CreationTabsTab
              hash="#main-information"
              selected={hash == "#main-information"}
              ref={section_main_info_ref}
            >
              Main Information
            </CreationTabsTab>
            <CreationTabsTab
              hash="#images&photos"
              selected={hash == "#images&photos"}
              ref={section_images_ref}
            >
              Image & Photos
            </CreationTabsTab>
            <CreationTabsTab
              hash="#content"
              selected={hash == "#content"}
              ref={section_content_ref}
            >
              Content
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
              {/* header info section */}
              <CreateDestination_HeaderInfo_Section
                ref={section_header_info_ref}
                id="#caption-information"
              />
              {/* main info section */}
              <CreateDestination_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* images section */}
              <CreateDestination_Images_Section
                ref={section_images_ref}
                id="#images&photos"
              />
              {/* content section */}
              <CreateDestination_Content_Section
                ref={section_content_ref}
                id="#content"
              />
              {/* SEO */}
              <CreateDestination_SEO_Section ref={section_seo_ref} id="#seo" />
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/destinations")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* Cancel */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create destination
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
