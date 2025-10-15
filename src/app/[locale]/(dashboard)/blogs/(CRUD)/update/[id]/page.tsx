"use client";
import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
  PageLayoutHeaderActions,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useRouter } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import BlogInterface from "@/interfaces/blog.interface";
import { crud_get_blog_by_id } from "@/lib/curd/blog";
import UpdateBlogFrom from "./_components/update-form";
import BlogCategoryInterface from "@/interfaces/blog-category.interface";
import BlogTagInterface from "@/interfaces/blog-tag.interface";
import { crud_get_all_blog_categories } from "@/lib/curd/blog-category";
import { crud_get_all_blog_tags } from "@/lib/curd/blog-tag";

export default function UpdateBlogPage({ params }: { params: { id: string } }) {
  // fetching state
  const [isFetchingData, setIsFetchingData] = useState(false);
  // form data
  const [formData, setFormData] = useState<{
    categories: BlogCategoryInterface[];
    tags: BlogTagInterface[];
  }>({
    categories: [],
    tags: [],
  });
  // selected blog
  const [oldBlog, setOldBlog] = useState<BlogInterface | null>(null);
  // router
  const router = useRouter();

  useEffect(() => {
    // if there no selected blog id
    if (!params?.id) {
      router.replace("/blogs");
      return;
    }
    // fetching the blog and the blog categories and tags which's needed for the creation of the blog
    (async () => {
      setIsFetchingData(true);
      try {
        // fetching the blog
        const blog = await crud_get_blog_by_id(params.id);

        // categories
        const categories = await crud_get_all_blog_categories({
          page: 0,
          size: 100,
        });

        // tags
        const tags = await crud_get_all_blog_tags({
          page: 0,
          size: 100,
        });

        if (blog && tags && categories) {
          // setting the blog
          setOldBlog(blog);
          // setting the form data
          setFormData({
            categories,
            tags,
          });
        }
      } catch (err) {
        toast.error("Something went wrong when fetching the data");
        router.replace("/blogs");
      }
      setIsFetchingData(false);
    })();
  }, []);

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Update Post
            </PageLayoutHeaderNameAndBreadcrumbsTitle>
            {/* breadcrumbs */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>Blogs</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Post</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>

          {/* actions */}
          <PageLayoutHeaderActions>
            <div className=""></div>
          </PageLayoutHeaderActions>
        </PageLayoutHeader>
        {!isFetchingData &&
        oldBlog &&
        formData &&
        formData.categories &&
        formData.tags ? (
          <UpdateBlogFrom oldBlog={oldBlog} formData={formData} />
        ) : (
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-[3em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
            <Skeleton className="w-full h-[30em] rounded-lg" />
          </div>
        )}
      </PageLayout>
    </>
  );
}
