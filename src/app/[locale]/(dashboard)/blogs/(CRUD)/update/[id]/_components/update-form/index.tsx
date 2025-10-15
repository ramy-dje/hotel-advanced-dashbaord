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
  UpdateBlogValidationSchema,
  UpdateBlogValidationSchemaType,
} from "./update-blog-validation.schema";
import { crud_update_blog } from "@/lib/curd/blog";
import { UploadFile } from "@/lib/storage";
import UpdateBlog_MainInformation_Section from "./components/main-info.section";
import UpdateBlog_Content_Section from "./components/content.section";
import UpdateBlog_SEO_Section from "./components/seo.section";
import BlogInterface from "@/interfaces/blog.interface";
import BlogCategoryInterface from "@/interfaces/blog-category.interface";
import BlogTagInterface from "@/interfaces/blog-tag.interface";
import UpdateBlog_TagsAndCategories_Section from "./components/tags-categories.section";

interface Props {
  oldBlog: BlogInterface;
  formData: {
    categories: BlogCategoryInterface[];
    tags: BlogTagInterface[];
  };
}
export default function UpdateBlogFrom({ oldBlog, formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateBlogValidationSchemaType>({
    resolver: zodResolver(UpdateBlogValidationSchema),
    defaultValues: {
      read_time: 1,
      categories: [],
      tags: [],
      old_categories: [],
      old_tags: [],
      seo_keywords: [],
      content: "",
      author: "",
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

  // set the old job data
  useEffect(() => {
    // set the old job data to the form
    if (oldBlog) {
      // main info
      methods.setValue("seo_slug", oldBlog.seo.slug);
      methods.setValue("title", oldBlog.title);
      methods.setValue("content", oldBlog.content);
      methods.setValue("read_time", oldBlog.readTime);
      methods.setValue("author", oldBlog.author);
      methods.setValue("image", oldBlog.image);
      methods.setValue("image_old_url", oldBlog.image);
      // setting the seo
      methods.setValue("seo_description", oldBlog.seo.description);
      methods.setValue("seo_title", oldBlog.seo.title);
      methods.setValue("seo_old_keywords", oldBlog.seo.keywords);
      // tags and categories
      methods.setValue("old_categories", oldBlog.categories || []);
      methods.setValue("old_tags", oldBlog.tags || []);
    }
  }, []);

  // handle update
  const handleUpdate = async (data: UpdateBlogValidationSchemaType) => {
    if (!oldBlog) return;

    setIsLoading(true);
    try {
      let img_url = null;

      // if the image is changed
      if (typeof data.image == "string" && data.image == data.image_old_url) {
        // old image
        img_url = data.image_old_url;
      } else {
        // new image
        // upload the image
        const public_url = await UploadFile(data.image, "blog-image");
        img_url = public_url;
      }

      // create the room
      await crud_update_blog(oldBlog.id, {
        title: data.title,
        author: data.author,
        content: data.content,
        categories: data.categories,
        tags: data.tags,
        image: img_url,
        readTime: data.read_time,
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
      toast.success("Blog Updated Successfully");
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
              <UpdateBlog_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />
              {/* tags and categories */}
              <UpdateBlog_TagsAndCategories_Section
                ref={section_tags_categories_ref}
                id="#tags-categories"
                formData={formData}
              />
              {/* content section */}
              <UpdateBlog_Content_Section
                ref={section_content_ref}
                id="#content"
              />
              {/* SEO */}
              <UpdateBlog_SEO_Section ref={section_seo_ref} id="#seo" />

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
            Update Blog
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
