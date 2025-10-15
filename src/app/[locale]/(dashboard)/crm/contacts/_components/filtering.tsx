import { DebouncedInput } from "@/components/debounced-input";
import FilteringSheet from "@/components/filtering-sheet";
import { FormQuickControlledComboboxComponent } from "@/components/from-combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFiltering from "@/hooks/use-filtering";
import useFilteringFetch from "@/hooks/use-filtering-fetch";
import { crud_get_all_crm_industries } from "@/lib/curd/crm-industry";
import { crud_get_all_crm_contact_occupations } from "@/lib/curd/crm-occupation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// The crm contact filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  email: string;
  gender: "male" | "female";
  location_global: string;
  location_country: string;
  phoneNumber: string;
  work_occupation: string;
  work_industry: string;
  work_company: string;
}

export default function CRMContactsPageFiltering({
  filters,
  setFilters,
}: Props) {
  const {
    isFiltered,
    filterValues,
    setFilterValue,
    handleClear,
    handleApplyFilters,
  } = useFiltering<FiltersType>({
    defaultValues: {
      email: "",
      location_country: "",
      location_global: "",
      name: "",
      phoneNumber: "",
      work_occupation: "",
      work_company: "",
      work_industry: "",
      gender: "" as any,
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // occupations
      occupations: () =>
        crud_get_all_crm_contact_occupations({
          page: 0,
          size: 100,
        }),

      // industries
      industries: () =>
        crud_get_all_crm_industries({
          page: 0,
          size: 100,
        }),
      // put here all the methods to fetch the needed data
    },
    false // fetch at first to 'false'
  );

  // sheet open state
  const [open, setOpen] = useState(false);

  // re-fetching if needed
  useEffect(() => {
    // if open is 'true'
    if (!open) return;
    refetch();
  }, [open]);

  return (
    <>
      <Button
        size="sm"
        variant={isFiltered ? "default" : "outline"}
        onClick={() => setOpen(true)}
        className={cn(
          "gap-2 font-normal tex t-accent-foreground/80",
          isFiltered && "text-white"
        )}
      >
        <BiFilterAlt className="size-4" /> Filters
      </Button>
      {/* filtering sheet */}

      <FilteringSheet
        title="CRM Contacts Filters"
        description="Filter contacts by name, gender, email, occupation, company..."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        {/* name */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Username or fullname"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        {/* gender */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="name">Gender</Label>
          <Select
            value={filterValues.gender || "both"}
            onValueChange={(e) =>
              setFilterValue("gender", e == "both" ? "" : e)
            }
          >
            <SelectTrigger id="gender" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">both</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* phone */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="phone">Phone Number</Label>
          <DebouncedInput
            id="phone"
            placeholder="Number (Mobile/Fax/Whatsapp/Viber)"
            value={filterValues.phoneNumber}
            onDebouncedValueChange={(e) =>
              setFilterValue("phoneNumber", e as string)
            }
          />
        </div>
        {/* email */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="email">Email</Label>
          <DebouncedInput
            id="email"
            placeholder="e.g mohamed@gmail.com"
            value={filterValues.email}
            onDebouncedValueChange={(e) => setFilterValue("email", e as string)}
          />
        </div>
        {/* location country */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="country">Country</Label>
          <DebouncedInput
            id="country"
            placeholder="e.g Algeria"
            value={filterValues.location_country}
            onDebouncedValueChange={(e) =>
              setFilterValue("location_country", e as string)
            }
          />
        </div>
        {/* location */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="location">Location</Label>
          <DebouncedInput
            id="location"
            placeholder="e.g Djelfa"
            value={filterValues.location_global}
            onDebouncedValueChange={(e) =>
              setFilterValue("location_global", e as string)
            }
          />
        </div>

        {/* check if the work occupation data is fetched how a combobox if not a simple input */}
        {data.occupations && data.occupations.length > 0 ? (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="occupation">Occupation</Label>
            <FormQuickControlledComboboxComponent
              name="occupation"
              id="occupation"
              placeholder="Occupation field"
              list={data.occupations.map((e) => ({
                label: e.name,
                value: e.name,
              }))}
              value={filterValues.work_occupation}
              setValue={(e) => setFilterValue("work_occupation", e as string)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="occupation">Occupation</Label>
            <DebouncedInput
              id="occupation"
              placeholder="Occupation field"
              value={filterValues.work_occupation}
              onDebouncedValueChange={(e) =>
                setFilterValue("work_occupation", e as string)
              }
            />
          </div>
        )}

        {/* check if the work industry data is fetched how a combobox if not a simple input */}
        {data.industries && data.industries.length > 0 ? (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="industry">Industry</Label>
            <FormQuickControlledComboboxComponent
              name="industry"
              id="industry"
              placeholder="Industry field"
              list={data.industries.map((e) => ({
                label: e.name,
                value: e.name,
              }))}
              value={filterValues.work_industry}
              setValue={(e) => setFilterValue("work_industry", e as string)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-3">
            <Label id="industry">Industry</Label>
            <DebouncedInput
              id="industry"
              placeholder="Industry field"
              value={filterValues.work_industry}
              onDebouncedValueChange={(e) =>
                setFilterValue("work_industry", e as string)
              }
            />
          </div>
        )}

        {/* company */}
        <div className="flex flex-col gap-2 mb-3">
          <Label id="company">Company</Label>
          <DebouncedInput
            id="company"
            placeholder="Company name"
            value={filterValues.work_company}
            onDebouncedValueChange={(e) =>
              setFilterValue("work_company", e as string)
            }
          />
        </div>
      </FilteringSheet>
    </>
  );
}
