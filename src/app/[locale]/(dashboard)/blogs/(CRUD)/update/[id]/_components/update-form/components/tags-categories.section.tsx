"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import { forwardRef, useEffect, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";
import { UpdateBlogValidationSchemaType } from "../update-blog-validation.schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineX } from "react-icons/hi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BlogCategoryInterface from "@/interfaces/blog-category.interface";
import BlogTagInterface from "@/interfaces/blog-tag.interface";

// Update blog categories and tags Section

interface Props {
  id: string;
  formData: {
    categories: BlogCategoryInterface[];
    tags: BlogTagInterface[];
  };
}

const UpdateBlog_TagsAndCategories_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData }, ref) => {
    const {
      formState: { disabled },
      control,
    } = useFormContext<UpdateBlogValidationSchemaType>();

    // categories
    const [categories, setCategories] = useState<
      { id: string; name: string }[]
    >([]);

    // tags
    const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

    // categories selector
    const [selectedCategory, setSelectedCategory] = useState("");

    // tags selector
    const [selectedTag, setSelectedTag] = useState("");

    // categories controller
    const categories_controller = useController({
      control,
      name: "categories",
    });

    // old categories controller
    const old_categories = useWatch({
      control,
      name: "old_categories",
    });

    // old tags controller
    const old_tags = useWatch({
      control,
      name: "old_tags",
    });

    // tags controller
    const tags_controller = useController({
      control,
      name: "tags",
    });

    // setting the categories
    useEffect(() => {
      if (categories) {
        categories_controller.field.onChange(categories.map((e) => e.id));
      }
    }, [categories]);

    // setting the tags
    useEffect(() => {
      if (tags) {
        tags_controller.field.onChange(tags.map((e) => e.id));
      }
    }, [tags]);

    // setting the old categories and tags
    useEffect(() => {
      if (old_tags && old_categories) {
        setCategories(old_categories);
        setTags(old_tags);
      }
    }, [old_categories, old_tags]);

    // methods

    // add key
    const handleAddKeyWord = (type: "tags" | "category") => {
      if (type == "category" && selectedCategory) {
        const selected_category = formData.categories.find(
          (e) => e.id == selectedCategory
        )!;

        setCategories((keys) => [
          ...keys,
          {
            id: selected_category.id,
            name: selected_category.name,
          },
        ]);

        setSelectedCategory("");
      } else if (type == "tags" && selectedTag) {
        const selected_tag = formData.tags.find((e) => e.id == selectedTag)!;

        setTags((keys) => [
          ...keys,
          {
            id: selected_tag.id,
            name: selected_tag.name,
          },
        ]);

        setSelectedTag("");
      }
    };

    // remove key
    const handelRemoveKey = (type: "tags" | "category", id: string) => {
      if (type == "category") {
        setCategories((categories) =>
          categories.filter((category) => category.id !== id)
        );
      } else if (type == "tags") {
        setTags((tags) => tags.filter((tag) => tag.id !== id));
      }
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Categories & Tags
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The post tags and categories
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* blog categories */}
          <div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
            <Label htmlFor="categories">Categories</Label>
            <div className="w-full flex items-center gap-5">
              <Select
                value={selectedCategory}
                onValueChange={(e) => setSelectedCategory(e)}
              >
                <SelectTrigger
                  disabled={disabled}
                  id="categories"
                  className="w-full"
                >
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {formData.categories
                    ? formData.categories.map((category) => (
                        <SelectItem
                          disabled={(() => {
                            return categories
                              .map((e) => e.id)
                              .includes(category.id);
                          })()}
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
              {/* add category */}
              <Button
                disabled={disabled}
                type="button"
                onClick={() => handleAddKeyWord("category")}
              >
                Add Category
              </Button>
            </div>
            {/* blog categories */}
            <div className="w-full flex items-center flex-wrap gap-3">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {category.name}
                  <button
                    onClick={() => handelRemoveKey("category", category.id)}
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
          {/* blog tags */}
          <div className="flex flex-col gap-2 col-span-2 lg:col-span-1">
            <Label htmlFor="tags">Tags</Label>
            <div className="w-full flex items-center gap-5">
              <Select
                value={selectedTag}
                onValueChange={(e) => setSelectedTag(e)}
              >
                <SelectTrigger disabled={disabled} id="tags" className="w-full">
                  <SelectValue placeholder="Choose a tag" />
                </SelectTrigger>
                <SelectContent>
                  {formData.tags
                    ? formData.tags.map((tag) => (
                        <SelectItem
                          disabled={(() => {
                            return tags.map((e) => e.id).includes(tag.id);
                          })()}
                          key={tag.id}
                          value={tag.id}
                        >
                          {tag.name}
                        </SelectItem>
                      ))
                    : null}
                </SelectContent>
              </Select>
              {/* add tag */}
              <Button
                disabled={disabled}
                type="button"
                onClick={() => handleAddKeyWord("tags")}
              >
                Add Tag
              </Button>
            </div>
            {/* blog tags */}
            <div className="w-full flex items-center flex-wrap gap-3">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="rounded-full gap-2 text-sm font-normal"
                >
                  {tag.name}
                  <button
                    onClick={() => handelRemoveKey("tags", tag.id)}
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
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateBlog_TagsAndCategories_Section;
