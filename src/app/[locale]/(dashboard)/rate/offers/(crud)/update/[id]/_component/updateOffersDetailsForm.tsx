import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "@/i18n/routing";
import {
  UpdateOffersValidationSchema,
  UpdateOffersValidationSchemaType,
} from "./updateOffersValidation.schema";
import CreateOffers_valid_from_to_Section from "./components/valid-from-to.section";
import { crud_get_offer_by_id, crud_update_offer } from "@/lib/curd/offers";
import UpdateOffer_Eligibility_Section from "./components/eligibility.section";
import UpdateOffer_Policies_Benifits_Section from "./components/policies-benifits.setion";
import { AiFillProduct } from "react-icons/ai";
import { FaBox, FaGift, FaMoneyCheck } from "react-icons/fa6";
import UpdateOffers_Discount_Value_Section from "./components/discount-value.section";
import UpdateRate_PurchaseRequirements_Section from "./components/purchase-requirements.section";
import UpdateOffers_Combination_Section from "./components/combination.section";
import UpdateOffers_Maximum_Discount_Uses_Section from "./components/maximum-discount-uses.section";
import UpdateOffer_DealMethod_Section from "./components/deal-method.section";
import UpdateOffers_BuyXGetY_Section from "./components/buyxgety.section";
import UpdateOffers_Package_Section from "./components/package.section";
import UpdateOffer_MainInformation_Section from "./components/main-info.section";
import {
  CreationFormContent,
  CreationFormFooterActions,
} from "@/components/creation-form";
import UpdateOffers_valid_from_to_Section from "./components/valid-from-to.section";
import { UploadFile } from "@/lib/storage";

export default function CreateOffersForm({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [oldImage, setOldImage] = useState("");
  // form
  const methods = useForm<UpdateOffersValidationSchemaType>({
    resolver: zodResolver(UpdateOffersValidationSchema),
  });
  // router
  const router = useRouter();

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("name");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleUpdate = async (data: UpdateOffersValidationSchemaType) => {

    let public_url = "";
    if (data.image && data.image != oldImage) {
      public_url = await UploadFile(data.image, "offer-image");
    }else{
      public_url = oldImage;
    }
    setIsLoading(true);
    try {
      await crud_update_offer(id, { ...data, image: public_url });
      router.push("/rate/offers");
      // tost
      toast.success("Offer Updated Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  // get the offer
  useEffect(() => {
    if (!id) return;
    crud_get_offer_by_id(id).then((res) => {
      methods.reset(res);
      methods.setValue("image_url", res.image);
      setOldImage(res.image);
    });
  }, [id]);
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
  const offerType = methods.watch("type");

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleUpdate)}>
        <div className="flex lg:flex-row flex-col gap-2">
          <div className="lg:w-[70%] w-full  min-h-screen">
            <FormProvider {...methods}>
              <CreationFormContent className="divide-none grid gap-0 xl:gap-0">
                {/* main info section */}
                <UpdateOffer_MainInformation_Section />
                <UpdateOffer_DealMethod_Section />
                {offerType == "buyXGetY" && <UpdateOffers_BuyXGetY_Section />}
                {offerType == "package" && <UpdateOffers_Package_Section />}
                {(offerType == "amountOfProducts" ||
                  offerType == "amountOfOrder") && (
                  <UpdateOffers_Discount_Value_Section />
                )}
                <UpdateRate_PurchaseRequirements_Section />
                <UpdateOffer_Eligibility_Section />
                <UpdateOffers_Maximum_Discount_Uses_Section />
                <UpdateOffers_Combination_Section />
                <UpdateOffers_valid_from_to_Section />
                <UpdateOffer_Policies_Benifits_Section />
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
                <span>{methods.watch("timeValidity.startDate")?.toString().split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid To</span>
                <span>
                  {methods.watch("timeValidity.endDate")?.toString().split("T")[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Is active</span>
                <span>{methods.watch("isActive") ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span>Accept combinations</span>
                <span>{methods.watch("combinations") ? "Yes" : "No"}</span>
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
            Update offer
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
