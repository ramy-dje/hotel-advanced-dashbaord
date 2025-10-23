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
import { Link } from "@/i18n/routing";
import UpdateOfferForm from "./_component/updateOffersDetailsForm";

export default function CreateRatePage({params}: {params: {id: string}}) {

  return (
    <>
      {/* page layout */}
      <PageLayout>
        {/* header of the page */}
        <PageLayoutHeader className="mb-3">
          {/* name and breadcrumbs */}
          <PageLayoutHeaderNameAndBreadcrumbs>
            <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
              Update offer
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
                <BreadcrumbItem>Rate</BreadcrumbItem>
                <BreadcrumbSeparator
                  children={
                    <span className="size-1 block rounded-full bg-muted-foreground/50" />
                  }
                />
                <BreadcrumbItem>
                  <BreadcrumbPage>Offer</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </PageLayoutHeaderNameAndBreadcrumbs>


        </PageLayoutHeader>
        <UpdateOfferForm id={params.id} />
      </PageLayout>
    </>
  );
}
