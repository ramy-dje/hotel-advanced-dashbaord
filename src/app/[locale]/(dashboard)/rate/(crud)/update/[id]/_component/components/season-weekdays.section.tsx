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
import { forwardRef, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { UpdateRateValidationSchemaType } from "../updateRateDetailsValidation.schema";

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
import CreateRateSeasonPopup from "../../../../../seasons/_components/create-rate-season-popup";

// Types
interface SeasonPeriod {
  beginSellDate: string;
  endSellDate: string;
  weekdays: string[];
}

interface Props {
  id: string;
  formData: {
    seasons: RatePlanSeasonInterface[];
    rateCategories: RatePlanCategoryInterface[];
  };
  seasonName?: string;
  seasonPeriods?: SeasonPeriod[];
  parentSeasonData?: {
    name: string;
    periods: SeasonPeriod[];
  };
}

const UpdateRate_Season_Weekdays_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, formData, seasonName, seasonPeriods, parentSeasonData }, ref) => {
    const {
      formState: { errors },
      setValue,
    } = useFormContext<UpdateRateValidationSchemaType>();

    const [predefinedSeasons, setPredefinedSeasons] = useState<RatePlanSeasonInterface[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<string>(seasonName || "");
    const [existedSeasonData, setExistedSeasonData] = useState<SeasonPeriod[] | null>(
      seasonPeriods || null
    );

    // Initialize values when props change
    useEffect(() => {
      if (parentSeasonData) {
        setSelectedSeason(parentSeasonData.name);
        setExistedSeasonData(parentSeasonData.periods);
      } else {
        if (seasonName) setSelectedSeason(seasonName);
        if (seasonPeriods) setExistedSeasonData(seasonPeriods);
      }
    }, [seasonName, seasonPeriods, parentSeasonData]);

    useEffect(() => {
      setPredefinedSeasons(formData.seasons);
    }, [formData]);
    const handleSeasonChange = (seasonName: string) => {
      const season = predefinedSeasons.find((s) => s.name === seasonName);
      if (!season) return;

      setSelectedSeason(season.name);
      setValue("predefinedSeason", season.id);
      const seasonPeriods = season.periods.map((period: any) => ({
        beginSellDate: period.beginSellDate.slice(0, 10),
        endSellDate: period.endSellDate.slice(0, 10),
        weekdays: period.weekdays || [],
      }));

      setExistedSeasonData(seasonPeriods);
    };

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>Seasons and Weekdays</CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            Add one or more seasonal periods when this rate applies.
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>

        <CreationFormSectionContent>
          <div className="relative col-span-2">
            <Label htmlFor="predefinedSeason">Predefined Season</Label>

            <div className="flex gap-2">
              <Select value={selectedSeason} onValueChange={handleSeasonChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a season" />
                </SelectTrigger>
                <SelectContent>
                  {predefinedSeasons.map((season) => (
                    <SelectItem key={season.id} value={season.name}>
                      {season.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <CreateRateSeasonPopup />
            </div>

            {errors?.predefinedSeason && (
              <InlineAlert type="error">
                {errors.predefinedSeason.message?.toString()}
              </InlineAlert>
            )}
          </div>

          {existedSeasonData && (
            <ExistedSeasonCard
              setSelectedSeason={setSelectedSeason}
              setExistedSeasonDAta={setExistedSeasonData}
              setValue={setValue}
              selectedSeason={selectedSeason}
              existedSeasonData={existedSeasonData}
            />
          )}
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default UpdateRate_Season_Weekdays_Section;
