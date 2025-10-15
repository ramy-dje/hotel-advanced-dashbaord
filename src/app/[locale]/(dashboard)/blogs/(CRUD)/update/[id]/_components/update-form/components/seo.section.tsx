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
import { forwardRef, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { UpdateBlogValidationSchemaType } from "../update-blog-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import slugify from "slugify";

const generateId = () => Math.random().toString(16).slice(2).toString();

// Update Blog SEO Section

interface Props {
  id: string;
}

const UpdateBlog_SEO_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      setValue,
      control,
      register,
    } = useFormContext<UpdateBlogValidationSchemaType>();

    const [keywords, setKeywords] = useState<{ id: string; key: string }[]>([]);
    const keywords_input_ref = useRef<HTMLInputElement>(null);

    // old keywords controller
    const old_keywords_controller = useController({
      control,
      name: "seo_old_keywords",
    });

    // keywords controller
    const keywords_controller = useController({
      control,
      name: "seo_keywords",
    });

    // title controller
    const title_controller = useController({
      control,
      name: "title",
    });

    // setting the slug
    useEffect(() => {
      if (title_controller.field.value) {
        const slug = slugify(title_controller.field.value, {
          lower: true,
          trim: true,
        });
        setValue("seo_slug", slug);
        setValue("seo_title", title_controller.field.value);
      }
    }, [title_controller.field.value]);

    // setting the keywords
    useEffect(() => {
      if (keywords) {
        keywords_controller.field.onChange(keywords.map((e) => e.key));
      }
    }, [keywords]);

    // methods

    // add key
    const handleAddKeyWord = () => {
      if (
        keywords_input_ref.current?.value &&
        keywords_input_ref.current?.value.trim() &&
        keywords_input_ref.current?.value.trim().length >= 2
      ) {
        const tit = keywords_input_ref.current.value.trim();
        setKeywords((keys) => [
          ...keys,
          {
            id: generateId(),
            key: tit as string,
          },
        ]);
        keywords_input_ref.current.value = "";
      }
    };

    // setting the old keywords
    useEffect(() => {
      if (old_keywords_controller.field.value) {
        const old = old_keywords_controller.field.value.map((e) => ({
          id: generateId(),
          key: e,
        }));
        setKeywords(old);
      }
    }, [old_keywords_controller.field.value]);

    // remove key
    const handelRemoveKey = (id: string) => {
      setKeywords((keys) => keys.filter((key) => key.id !== id));
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Search Engine Optimization
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The post SEO metadata like title description and keywords
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* blog seo page title */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="pagetitle">Page Title</Label>
            <Input
              id="pagetitle"
              type="text"
              disabled={disabled}
              placeholder="Title"
              {...register("seo_title", {
                required: true,
              })}
            />
            {errors?.seo_title ? (
              <InlineAlert type="error">{errors.seo_title.message}</InlineAlert>
            ) : null}
          </div>
          {/* blog seo page slug */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="page-slug">Page Slug</Label>
            <Input
              id="pageslug"
              type="text"
              disabled={disabled}
              placeholder="Slug"
              {...register("seo_slug", {
                required: true,
              })}
            />
            {errors?.seo_slug ? (
              <InlineAlert type="error">{errors.seo_slug.message}</InlineAlert>
            ) : null}
          </div>
          {/* blog seo meta description */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="metadescription">Meta Description</Label>
            <Textarea
              id="metadescription"
              className="w-full h-[6em] resize-none"
              disabled={disabled}
              placeholder="Description"
              {...register("seo_description", {
                required: true,
              })}
            />
            {errors?.seo_description ? (
              <InlineAlert type="error">
                {errors.seo_description.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* blog seo keywords */}
          <div className="flex flex-col gap-3 col-span-2">
            <div className="w-full flex items-center gap-5">
              <Input
                type="Keyword"
                placeholder="Keyword"
                disabled={disabled}
                className="max-w-full xl:w-[24em]"
                ref={keywords_input_ref}
              />
              <Button
                disabled={disabled}
                type="button"
                onClick={handleAddKeyWord}
              >
                Add Keyword
              </Button>
            </div>
            {/* blog keywords */}
            <div className="w-full flex items-center flex-wrap gap-3">
              {keywords.map((keyword) => (
                <Badge
                  key={keyword.id}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {keyword.key}
                  <button
                    onClick={() => handelRemoveKey(keyword.id)}
                    type="button"
                    disabled={disabled}
                    className="text-foreground/60 hover:text-foreground/100"
                  >
                    <HiOutlineX className="size-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          {/* keywords error */}
          <div className="col-span-2">
            {errors?.seo_keywords ? (
              <InlineAlert type="error">
                {errors.seo_keywords.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateBlog_SEO_Section;
