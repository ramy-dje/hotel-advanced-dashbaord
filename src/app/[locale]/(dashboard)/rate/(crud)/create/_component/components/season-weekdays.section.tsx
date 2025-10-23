"use client";

import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Label } from "@/components/ui/label";
import InlineAlert from "@/components/ui/inline-alert";
import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateRateValidationSchemaType } from "../createRateDetailsValidation.schema";

import ExistedSeasonCard from "./existedSeasonCard";
import { RatePlanSeasonInterface } from "@/interfaces/rate-seasons.interface";
import RatePlanCategoryInterface from "@/interfaces/rate-category.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateRateSeasonPopup from "../../../../seasons/_components/create-rate-season-popup";

interface Props {
  id: string;
  formData: {
    seasons: RatePlanSeasonInterface[];
    rateCategories: RatePlanCategoryInterface[];
  };
  seasonData: any;
}

// Define types for the season data
interface SeasonPeriod {
  beginSellDate: string;
  endSellDate: string;
  weekdays: string[];
}
const CreateRate_Season_Weekdays_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData,seasonData }, ref) => {
    const {
      formState: { errors },
      setValue,
    } = useFormContext<CreateRateValidationSchemaType>();

    const [predefinedSeasons, setPredefinedSeasons] = useState<
      RatePlanSeasonInterface[]
    >([]);
    const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
    const [existedSeasonData, setExistedSeasonDAta] = useState<
      SeasonPeriod[] | null
    >(null);

    useEffect(() => {
      setPredefinedSeasons(formData.seasons);
    }, [formData]);
    useEffect(() => {
      if (seasonData) {
        console.log(seasonData);
        setSelectedSeason(seasonData.name);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const seasonPeriods = seasonData.periods?.map((period: any) => ({
          beginSellDate: new Date(period.beginSellDate)
            .toISOString()
            .slice(0, 10),
          endSellDate: new Date(period.endSellDate)
            .toISOString()
            .slice(0, 10),
          weekdays: period.weekdays || [],
        }));
        setExistedSeasonDAta(seasonPeriods);
      }
    }, [seasonData]);

    return (
      <CreationFormSection
        ref={ref}
        id={id}
      >
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Seasons and Weekdays
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Add one or more seasonal periods when this rate applies.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent>
          {/* ✅ One global Predefined Season field */}
          <div className="relative col-span-2">
            <Label htmlFor="predefinedSeason">Predefined Season (optional)</Label>

            <div className="flex gap-2">
              <Select
                value={selectedSeason || ""}
                onValueChange={(e) => {
                  const season = predefinedSeasons.find(
                    (season) => season.name == e,
                  );
                  if (season) {
                    setSelectedSeason(season.name);
                    setValue("predefinedSeason", season.id);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const seasonPeriods = season.periods?.map((period: any) => ({
                      beginSellDate: new Date(period.beginSellDate)
                        .toISOString()
                        .slice(0, 10),
                      endSellDate: new Date(period.endSellDate)
                        .toISOString()
                        .slice(0, 10),
                      weekdays: period.weekdays || [],
                    }));
                    setExistedSeasonDAta(seasonPeriods);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="select a rate season" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedSeasons?.map((season) => (
                    <SelectItem
                      key={season.id}
                      value={season.name}
                    >
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CreateRateSeasonPopup />
            </div>
            {errors.predefinedSeason && (
              <InlineAlert type="error">
                {errors.predefinedSeason.message?.toString()}
              </InlineAlert>
            )}
          </div>
          {existedSeasonData && (
            <ExistedSeasonCard
              setSelectedSeason={setSelectedSeason}
              setExistedSeasonDAta={setExistedSeasonDAta}
              setValue={setValue}
              selectedSeason={selectedSeason}
              existedSeasonData={existedSeasonData}
            />
          )}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  },
);

export default CreateRate_Season_Weekdays_Section;
