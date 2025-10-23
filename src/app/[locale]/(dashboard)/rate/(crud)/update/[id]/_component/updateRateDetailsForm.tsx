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
  UpdateRateValidationSchema,
  UpdateRateValidationSchemaType,
} from "./updateRateDetailsValidation.schema";
import CreateRate_MainInformation_Section from "./components/main-info.section";
import CreateRate_Meals_Section from "./components/meals.section";
import CreateRate_Season_Weekdays_Section from "./components/season-weekdays.section";
import CreateRate_Rooms_Section from "./components/rooms.section";
import { crud_create_rate, crud_update_rate } from "@/lib/curd/rate";
import { calculateTotal, detectMealPlan } from "@/lib/utils";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import { RatePlanInterface } from "@/interfaces/rate.interface";
import DynamicRateTable from "./components/rateTable";
import CreateRate_Refund_Section from "./components/refund.section";
import CreateRate_Restrictions_Section from "./components/restrictions.section";
import { TaxInterface } from "@/interfaces/taxes.interface";
import RatePlanServiceInterface from "@/interfaces/room-extra-services";
import UpdateRate_ExtraServices_Section from "./components/extra-services.section";
import { Switch } from "@/components/ui/switch";
interface Props {
  formData: {
    rateCategories: RatePlanCategoryInterface[];
    seasons: RatePlanSeasonInterface[];
    taxes: TaxInterface[];
    services: RatePlanServiceInterface[];
  };
  oldRate: any;
}
export default function CreateRateForm({ formData, oldRate }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateRateValidationSchemaType>({
    resolver: zodResolver(UpdateRateValidationSchema),
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const rooms_ref = useRef<HTMLDivElement>(null);
  const meals_ref = useRef<HTMLDivElement>(null);
  const season_ref = useRef<HTMLDivElement>(null);
  const restrictions_ref = useRef<HTMLDivElement>(null);
  const yield_management_ref = useRef<HTMLDivElement>(null);
  const pricing_ref = useRef<HTMLDivElement>(null);
  const extra_services_ref = useRef<HTMLDivElement>(null);
  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const strgifiedId = oldRate.predefinedSeason?._id?.toString() || "";
    const oldCategory = oldRate.rateCategory?._id?.toString() || "";
    methods.setFocus("rateName");
    window.scrollTo({ top: 0 });
    const updatedRate = {
      ...oldRate,
      rateCategory: oldCategory,
      predefinedSeason: strgifiedId,
    };
    console.log(updatedRate);
    methods.reset(updatedRate);
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleUpdate = async (data: UpdateRateValidationSchemaType) => {
    setIsLoading(true);
    console.log(data);
    try {
      // create the room
      await crud_update_rate(oldRate._id, data);
      router.push("/rate/overview");
      setIsLoading(false);
      // // resetting the form
      methods.reset();
      // tost
      toast.success("Rate Updated Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };
  const [parentSeasonData, setParentSeasonData] = useState<any>(null);

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
              ref={rooms_ref}
            >
              Rooms to attribute
            </CreationTabsTab>
            <CreationTabsTab
              hash="#content"
              selected={hash == "#content"}
              ref={meals_ref}
            >
              Meals plan
            </CreationTabsTab>
            <CreationTabsTab
              hash="#seo"
              selected={hash == "#seo"}
              ref={season_ref}
            >
              Season and weekdays
            </CreationTabsTab>
            <CreationTabsTab
              hash="#restrictions"
              selected={hash == "#restrictions"}
              ref={restrictions_ref}
            >
              Rules and Restrictions
            </CreationTabsTab>
            <CreationTabsTab
              hash="#pricing"
              selected={hash == "#pricing"}
              ref={pricing_ref}
            >
              Pricing
            </CreationTabsTab>
            <CreationTabsTab
              hash="#yield-management"
              selected={hash == "#yield-management"}
              ref={yield_management_ref}
            >
              Extra options
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <CreateRate_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
                formData={formData}
                setParentSeasonData={setParentSeasonData}
              />
              {/* rooms section */}
              <CreateRate_Rooms_Section
                ref={rooms_ref}
                id="#rooms"
                formData={formData as any}
              />
              {/* meals section */}
              <CreateRate_Meals_Section
                ref={meals_ref}
                id="#meals"
              />
              {/* SEO */}
              <CreateRate_Season_Weekdays_Section
                ref={season_ref}
                id="#season-weekdays"
                formData={formData}
                seasonName={oldRate.predefinedSeason?.name}
                seasonPeriods={oldRate.predefinedSeason?.periods}
                parentSeasonData={parentSeasonData}
              />
              {/* restrictions section */}
              <CreateRate_Restrictions_Section
                id="#restrictions"
                taxes={formData.taxes}
              />
              {/* yield management section */}
              <CreateRate_Refund_Section
                ref={yield_management_ref}
                id="#yield-management"
              />

              {/* <div className="mb-[5em]"></div> */}
            </CreationFormContent>
            <h1
              ref={pricing_ref}
              className="text-lg font-semibold mb-1"
            >
              Pricing
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              Set the price for each room type and occupancy.
            </p>
            <DynamicRateTable methods={methods} />
            <CreationFormContent>
              <UpdateRate_ExtraServices_Section
                ref={extra_services_ref}
                id="#extra-services"
                services={formData.services}
              />
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions className="flex justify-between">
          <div className="flex gap-12">
            <div className=" w-[110px]">
              <p className="text-xs text-gray-500">Selected rooms</p>
              <p className="text-lg font-semibold">2 rooms</p>
            </div>
            <div className="border-l-2 w-[150px] border-gray-500 pl-2">
              <p className="text-xs text-gray-500">Total price</p>
              <p className="text-lg font-semibold">
                {calculateTotal(
                  methods.watch("tiersTable"),
                  methods.watch("factorRateCalculator"),
                  methods.watch("maxStay" ) as number,
                )}{" "}
                Da
              </p>
            </div>
            <div className="border-l-2 w-[110px] border-gray-500 pl-2">
              <p className="text-xs text-gray-500">Tax included</p>
              <Switch
                className="mt-1"
                size="sm"
                checked={methods.watch("taxIncluded")}
                onCheckedChange={(checked) =>
                  methods.setValue("taxIncluded", checked)
                }
              />
            </div>
            <div className="border-l-2 w-[110px] border-gray-500 pl-2">
              <p className="text-xs text-gray-500">Total guests</p>
              <p className="text-lg font-semibold">
                {methods.watch("tiersTable")?.tiers[0].baseOccupants.adult +
                  methods.watch("tiersTable")?.tiers[0].baseOccupants.child}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/rate/overview")}
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
              Update rate
            </Button>
          </div>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
