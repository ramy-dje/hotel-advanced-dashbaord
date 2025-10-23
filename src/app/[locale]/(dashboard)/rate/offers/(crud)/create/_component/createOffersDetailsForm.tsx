import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import { useHash } from "@mantine/hooks";
import {
  CreateOffersValidationSchema,
  CreateOffersValidationSchemaType,
} from "./createOffersValidation.schema";
import CreateOffers_MainInformation_Section from "./components/main-info.section";
import CreateOffers_valid_from_to_Section from "./components/valid-from-to.section";
import { crud_create_offer } from "@/lib/curd/offers";
import CreateOffer_Eligibility_Section from "./components/eligibility.section";
import { useSearchParams } from "next/navigation";
import CreateOffer_Policies_Benifits_Section from "./components/policies-benifits.setion";
import { AiFillProduct } from "react-icons/ai";
import { FaBox, FaGift, FaMoneyCheck } from "react-icons/fa6";
import CreateOffers_Discount_Value_Section from "./components/discount-value.section";
import CreateRate_PurchaseRequirements_Section from "./components/purchase-requirements.section";
import CreateOffers_Combination_Section from "./components/combination.section";
import CreateOffers_Maximum_Discount_Uses_Section from "./components/maximum-discount-uses.section";
import CreateOffer_DealMethod_Section from "./components/deal-method.section";
import CreateOffers_BuyXGetY_Section from "./components/buyxgety.section";
import CreateOffers_Package_Section from "./components/package.section";
import { UploadFile } from "@/lib/storage";
import RoomExtraServiceInterface from "@/interfaces/room-extra-services";

interface FormData {
  services: RoomExtraServiceInterface[];
}
export default function CreateOffersForm({ formData }: { formData: FormData }) {
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateOffersValidationSchemaType>({
    resolver: zodResolver(CreateOffersValidationSchema),
  });
  // router
  const router = useRouter();
  // offre type
  const offerType = useSearchParams().get("offerType");

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("name");
    methods.setValue("eligibility.type", "allCustomers");
    methods.setValue("requirements.type", "no_requirements");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateOffersValidationSchemaType) => {
    setIsLoading(true);
    console.log(data);
    let public_url = "";
    if (data.image) {
      public_url = await UploadFile(data.image, "offer-image");
    }
    try {
      crud_create_offer({ ...data, type: offerType, image: public_url });
      router.push("/rate/offers");
      // tost
      toast.success("Offer Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };
  function getOfferTypeIcon(offerType: string) {
    if (offerType == "amountOfProducts") {
      return <AiFillProduct />;
    } else if (offerType == "buyXGetY") {
      return <FaGift />;
    } else if (offerType == "package") {
      return <FaBox />;
    } else if (offerType == "amountOfOrder") {
      return <FaMoneyCheck />;
    }
  }

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
        <div className="flex lg:flex-row flex-col gap-2">
          <div className="lg:w-[70%] w-full  min-h-screen">
            <FormProvider {...methods}>
              <CreationFormContent className="divide-none grid gap-0 xl:gap-0">
                {/* main info section */}
                <CreateOffers_MainInformation_Section />
                <CreateOffer_DealMethod_Section />
                {offerType == "buyXGetY" && <CreateOffers_BuyXGetY_Section />}
                {offerType == "package" && <CreateOffers_Package_Section formData={formData}/>}
                {(offerType == "amountOfProducts" ||
                  offerType == "amountOfOrder") && (
                  <CreateOffers_Discount_Value_Section />
                )}
                <CreateRate_PurchaseRequirements_Section />
                <CreateOffer_Eligibility_Section />
                <CreateOffers_Maximum_Discount_Uses_Section />
                <CreateOffers_Combination_Section />
                <CreateOffers_valid_from_to_Section />
                <CreateOffer_Policies_Benifits_Section />
              </CreationFormContent>
            </FormProvider>
          </div>
          <div className="lg:w-[30%] h-[600px] p-4 xl:mt-[45px] mt-[30px] border border-gray-200 rounded-md shadow-md">
            <h1 className="text-lg font-semibold">Summary</h1>
            <br />
            <div className="flex flex-col gap-2 text-sm">
              {methods.watch("method") == "code" ? (
                <div className=" text-gray-500 mb-4 flex flex-col">
                  <span className="font-semibold text-md">Code</span>
                  <span>{methods.watch("code") || "no discount code yet"}</span>
                </div>
              ) : (
                <div className=" text-gray-500 mb-4 flex flex-col">
                  <span className="font-semibold text-md">Title</span>
                  <span>
                    {methods.watch("name") || "no discount title yet"}
                  </span>
                </div>
              )}
              <div className="text-gray-500 mb-4 flex flex-col">
                <span className="font-semibold text-md">Offer Type</span>
                <span className="flex items-center gap-2">
                  {getOfferTypeIcon(offerType || "")} {offerType}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valid From</span>
                <span>
                  {methods.watch("timeValidity.startDate") || '/'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Valid To</span>
                <span>
                  {methods.watch("timeValidity.endDate") || '/'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Is active</span>
                <span>{methods.watch("isActive") ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Accept combinations</span>
                <span>
                  {methods.watch("combinations") ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Discount method</span>
                <span>{methods.watch("method")}</span>
              </div>
            </div>
          </div>
        </div>

        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/rate/offers")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* Save as draft */}
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            isLoading={isLoading}
            type="submit"
          >
            Creat offer
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
