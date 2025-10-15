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
  CreateBlogValidationSchema,
  CreateBlogValidationSchemaType,
} from "./create-blog-validation.schema";
import CreateBlog_MainInformation_Section from "./components/main-info.section";
import CreateBlog_Content_Section from "./components/content.section";
import CreateBlog_SEO_Section from "./components/seo.section";
import { crud_create_blog } from "@/lib/curd/blog";
import { UploadFile } from "@/lib/storage";
import CreateBlog_TagsAndCategories_Section from "./components/tags-categories.section";
import BlogCategoryInterface from "@/interfaces/blog-category.interface";
import BlogTagInterface from "@/interfaces/blog-tag.interface";

interface Props {
  formData: {
    categories: BlogCategoryInterface[];
    tags: BlogTagInterface[];
  };
}
export default function CreateBlogFrom({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateBlogValidationSchemaType>({
    resolver: zodResolver(CreateBlogValidationSchema),
    defaultValues: {
      read_time: 1,
      categories: [],
      tags: [],
      content: "",
      author: "",
      seo_keywords: [],
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const section_content_ref = useRef<HTMLDivElement>(null);
  const section_tags_categories_ref = useRef<HTMLDivElement>(null);
  const section_seo_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("title");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateBlogValidationSchemaType) => {
    setIsLoading(true);
    try {
      // upload the image
      const public_url = await UploadFile(data.image, "blog-image");

      // create the room
      await crud_create_blog({
        title: data.title,
        author: data.author,
        content: data.content,
        image: public_url,
        readTime: data.read_time,
        categories: data.categories,
        tags: data.tags,
        seo: {
          description: data.seo_description,
          keywords: data.seo_keywords,
          slug: data.seo_slug,
          title: data.seo_title,
        },
      });
      // clearing the image object URL
      if (data.image_url) {
        URL.revokeObjectURL(data.image_url);
      }
      // to the blogs page
      router.push("/blogs");
      // tost
      toast.success("Blog Created Successfully");
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
              hash="#main-information"
              selected={hash == "#main-information"}
              ref={section_main_info_ref}
            >
              Main Information
            </CreationTabsTab>
            <CreationTabsTab
              hash="#tags-categories"
              selected={hash == "#tags-categories"}
              ref={section_tags_categories_ref}
            >
              Tags & Categories
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
              {/* main info section */}
              <CreateBlog_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* tags and categories */}
              <CreateBlog_TagsAndCategories_Section
                ref={section_tags_categories_ref}
                id="#tags-categories"
                formData={formData}
              />
              {/* content section */}
              <CreateBlog_Content_Section
                ref={section_content_ref}
                id="#content"
              />
              {/* SEO */}
              <CreateBlog_SEO_Section ref={section_seo_ref} id="#seo" />

              {/* <div className="mb-[5em]"></div> */}
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/blogs")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* Save as draft */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Create Post
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
