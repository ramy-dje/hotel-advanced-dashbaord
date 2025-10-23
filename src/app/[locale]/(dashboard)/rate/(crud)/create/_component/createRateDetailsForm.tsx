import { FormProvider, useForm, useWatch } from "react-hook-form";
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
  CreateRateValidationSchema,
  CreateRateValidationSchemaType,
} from "./createRateDetailsValidation.schema";
import CreateRate_MainInformation_Section from "./components/main-info.section";
import CreateRate_Meals_Section from "./components/meals.section";
import CreateRate_Season_Weekdays_Section from "./components/season-weekdays.section";
import CreateRate_Rooms_Section from "./components/rooms.section";
import { crud_create_rate } from "@/lib/curd/rate";
import { calculateTotal, detectMealPlan } from "@/lib/utils";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import CreateRate_Restrictions_Section from "./components/restrictions.section";
import CreateRate_Refund_Section from "./components/refund.section";
import DynamicRateTable from "./components/rateTable";
import { TaxInterface } from "@/interfaces/taxes.interface";
import CreateRate_ExtraServices_Section from "./components/extra-services.section";
import RatePlanServiceInterface from "@/interfaces/room-extra-services";
import { Switch } from "@/components/ui/switch";

interface Props {
  formData: {
    rateCategories: RatePlanCategoryInterface[];
    seasons: RatePlanSeasonInterface[];
    taxes: TaxInterface[];
    services: RatePlanServiceInterface[];
  };
}
export default function CreateRateForm({ formData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateRateValidationSchemaType>({
    resolver: zodResolver(CreateRateValidationSchema),
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
    // scroll to top
    methods.setFocus("rateName");
    window.scrollTo({ top: 0 });
  }, []);

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  const [seasonData, setSeasonData] = useState({});

  // handle create
  const handleCreate = async (data: CreateRateValidationSchemaType) => {
    console.log(data);
    setIsLoading(true);
    try {
      await crud_create_rate({
        ...data,
        mealPlanCode: detectMealPlan(data.mealPlan),
      });
      router.push("/rate/overview");
      // tost
      toast.success("Rate Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
        <div className="w-full min-h-screen">
          {/* header */}
          <CreationTabsContent>
            <CreationTabsTab
              hash="#main-information"
              selected={hash == "#main-information"}
              ref={section_main_info_ref}
            >
              Main Informations
            </CreationTabsTab>
            <CreationTabsTab
              hash="#rooms"
              selected={hash == "#rooms"}
              ref={rooms_ref}
            >
              Room attribution
            </CreationTabsTab>
            <CreationTabsTab
              hash="#content"
              selected={hash == "#content"}
              ref={meals_ref}
            >
              Meals plan
            </CreationTabsTab>
            <CreationTabsTab
              hash="#season-weekdays"
              selected={hash == "#season-weekdays"}
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
              hash="#yield-management"
              selected={hash == "#yield-management"}
              ref={yield_management_ref}
            >
              Yield Management
            </CreationTabsTab>
            <CreationTabsTab
              hash="#pricing"
              selected={hash == "#pricing"}
              ref={pricing_ref}
            >
              Pricing
            </CreationTabsTab>
            <CreationTabsTab
              hash="#extra-services"
              selected={hash == "#extra-services"}
              ref={extra_services_ref}
            >
              Extra services
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <CreateRate_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
                formData={formData}
                setSeasonData={setSeasonData}
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
              {/* season and weekdays section */}
              <CreateRate_Season_Weekdays_Section
                ref={season_ref}
                id="#season-weekdays"
                formData={formData}
                seasonData={seasonData}
              />
              {/* restrictions section */}
              <CreateRate_Restrictions_Section
                ref={restrictions_ref}
                id="#restrictions"
                taxes={formData.taxes}
              />
              {/* yield management section */}
              <CreateRate_Refund_Section
                ref={yield_management_ref}
                id="#yield-management"
              />
            </CreationFormContent>
            {/* pricing section */}
            <h1 ref={pricing_ref} className="text-lg font-semibold mb-1">Pricing</h1>
            <p className="text-sm mb-4">
              Set the price for each room type and occupancy.
            </p>
            <DynamicRateTable />
            <CreationFormContent>
              {/* extra services section */}
              <CreateRate_ExtraServices_Section
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
              <p className="text-xs text-gray-500">{methods.watch("factorRateCalculator") === "PER_ACC" ? "Total price" : "Total per night"}</p>
              <p className="text-lg font-semibold">
                {calculateTotal(
                  methods.watch("tiersTable"),
                  methods.watch("factorRateCalculator"),
                  methods.watch("maxStay"),
                )}{" "}
                DZD
              </p>
            </div>
            <div className="border-l-2 w-[110px] border-gray-500 pl-2">
              <p className="text-xs text-gray-500">Tax included</p>
              <Switch
              className="mt-1"
              size="sm"
              checked={methods.watch("taxIncluded")}
              onCheckedChange={(checked) => methods.setValue("taxIncluded", checked)}
              />
            </div>
            <div className="border-l-2 w-[110px] border-gray-500 pl-2">
              <p className="text-xs text-gray-500">Total guests</p>
              <p className="text-lg font-semibold">
                {methods.watch("tiersTable")?.tiers[0].baseOccupants.adult + methods.watch("tiersTable")?.tiers[0].baseOccupants.child}
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
              variant="default"
            >
              Create rate
            </Button>
          </div>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
