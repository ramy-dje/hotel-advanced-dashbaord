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
import CreateOfferForm from "./_component/createOffersDetailsForm";
import { useEffect, useState } from "react";
import { crud_get_all_roomExtraServices } from "@/lib/curd/room-extra-services";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";


interface FormData {
  services: RoomExtraServiceInterface[];
}
export default function CreateRatePage() {
  // form data contains necessary informations of offers
  const [formData, setFormData] = useState<FormData>({ services: [] });
  useEffect(() => {
    (async () => {
      const services = await crud_get_all_roomExtraServices({
        page: 0,
        size: 100,
      });
      setFormData({ services });
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
              Create offer
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
        <CreateOfferForm formData={formData}/>
      </PageLayout>
    </>
  );
}
