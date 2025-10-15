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
  UpdateDestinationValidationSchema,
  UpdateDestinationValidationSchemaType,
} from "./update-destination-validation.schema";
import { UploadFile } from "@/lib/storage";
import { crud_update_destination } from "@/lib/curd/destination";
import DestinationInterface from "@/interfaces/destination.interface";
import UpdateDestination_HeaderInfo_Section from "./components/header-info.section";
import UpdateDestination_MainInformation_Section from "./components/main-info.section";
import UpdateDestination_Images_Section from "./components/images.section";
import UpdateDestination_Content_Section from "./components/content.section";
import UpdateDestination_SEO_Section from "./components/seo.section";

interface Props {
  oldDestination: DestinationInterface;
}
export default function UpdateDestinationFrom({ oldDestination }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateDestinationValidationSchemaType>({
    resolver: zodResolver(UpdateDestinationValidationSchema),
    defaultValues: {
      features: [],
      distance: 5,
      main_image: null,
      seo_old_keywords: [],
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

  // set the old destination data
  useEffect(() => {
    // set the old destination data to the form
    if (oldDestination) {
      // header info
      methods.setValue("header_title", oldDestination.header.title);
      methods.setValue("header_sub_title", oldDestination.header.sub_title);
      methods.setValue("header_description", oldDestination.header.description);
      // main info
      methods.setValue("title", oldDestination.title);
      methods.setValue("sub_title", oldDestination.sub_title);
      methods.setValue("content", oldDestination.content);
      methods.setValue("distance", oldDestination.distance);
      methods.setValue("old_features", oldDestination.features);
      // images
      methods.setValue("main_image_url", oldDestination.image);
      methods.setValue("gallery_images_url", oldDestination.images_gallery);
      // setting the seo
      methods.setValue("seo_description", oldDestination.seo.description);
      methods.setValue("seo_title", oldDestination.seo.title);
      methods.setValue("seo_slug", oldDestination.seo.slug);
      methods.setValue("seo_old_keywords", oldDestination.seo.keywords);
    }
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateDestinationValidationSchemaType) => {
    if (!oldDestination.id) return;
    setIsLoading(true);
    try {
      // Upload the main Image
      let mainImage_public_url = "";

      if (data.main_image && data.main_image instanceof File) {
        // uploading the main image
        const public_url = await UploadFile(
          data.main_image,
          "destination-image"
        );
        if (public_url) {
          mainImage_public_url = public_url;
        }
      } else {
        mainImage_public_url = data.main_image || "";
      }

      // uploading the gallery images
      let public_urls: string[] = [];

      // upload the images
      for (let i = 0; i < data.gallery_images.length; i++) {
        const img = data.gallery_images[i];
        if (img instanceof File) {
          const url = await UploadFile(img, "destination-image");
          // pushing the url to the urls
          public_urls.push(url);
        } else {
          // pushing the url to the img
          public_urls.push(img);
        }
      }

      // create the room
      await crud_update_destination(oldDestination.id, {
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
        image: mainImage_public_url as string,
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
      toast.success("Destination Updated Successfully");
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
              hash="#caption-information"
              selected={hash == "#header-information"}
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
              <UpdateDestination_HeaderInfo_Section
                ref={section_header_info_ref}
                id="#caption-information"
              />
              {/* main info section */}
              <UpdateDestination_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* images section */}
              <UpdateDestination_Images_Section
                ref={section_images_ref}
                id="#images&photos"
              />
              {/* content section */}
              <UpdateDestination_Content_Section
                ref={section_content_ref}
                id="#content"
              />
              {/* SEO */}
              <UpdateDestination_SEO_Section ref={section_seo_ref} id="#seo" />
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
            Update destination
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
