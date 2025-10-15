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
import { CreateRoomValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import slugify from "slugify";

const generateId = () => Math.random().toString(16).slice(2).toString();

// Create Room SEO Section

interface Props {
  id: string;
}

const CreateRoom_SEO_Section = forwardRef<HTMLDivElement, Props>(
  ({ id }, ref) => {
    const {
      formState: { errors, disabled },
      setValue,
      control,
      register,
    } = useFormContext<CreateRoomValidationSchemaType>();

    const [keywords, setKeywords] = useState<{ id: string; key: string }[]>([]);
    const keywords_input_ref = useRef<HTMLInputElement>(null);

    // keywords controller
    const keywords_controller = useController({
      control,
      name: "seo.keywords",
    });

    // name controller
    const name_controller = useController({
      control,
      name: "seo",
    });

    // setting the slug
    // useEffect(() => {
    //   if (name_controller.field.value) {
    //     const slug = slugify(name_controller.field.value, {
    //       lower: true,
    //       trim: true,
    //     });
    //     setValue("seo.slug", slug);
    //     setValue("seo.title", name_controller.field.value);
    //   }
    // }, [name_controller.field.value]);

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
            The room SEO metadata like title description and keywords
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* room seo page title */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="pagetitle">Page Title</Label>
            <Input
              id="pagetitle"
              type="text"
              disabled={disabled}
              placeholder="Title"
              {...register("seo.title", {
                required: true,
              })}
            />
            {errors?.seo?.title ? (
              <InlineAlert type="error">{errors.seo.title.message}</InlineAlert>
            ) : null}
          </div>
          {/* room seo page slug */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="page-slug">Page Slug</Label>
            <Input
              id="pageslug"
              type="text"
              disabled={disabled}
              placeholder="Slug"
              {...register("seo.slug", {
                required: true,
              })}
            />
            {errors?.seo?.slug ? (
              <InlineAlert type="error">{errors?.seo?.slug.message}</InlineAlert>
            ) : null}
          </div>
          {/* room seo meta description */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="metadescription">Meta Description</Label>
            <Textarea
              id="metadescription"
              className="w-full h-[6em] resize-none"
              disabled={disabled}
              placeholder="Description"
              {...register("seo.description", {
                required: true,
              })}
            />
            {errors?.seo?.description ? (
              <InlineAlert type="error">
                {errors.seo?.description.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* room seo keywords */}
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
            {/* room keywords */}
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
            {errors?.seo?.keywords ? (
              <InlineAlert type="error">
                {errors.seo?.keywords.message}
              </InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateRoom_SEO_Section;
