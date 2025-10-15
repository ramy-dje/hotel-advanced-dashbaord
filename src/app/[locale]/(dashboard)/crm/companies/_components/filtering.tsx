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
import { crud_get_all_crm_company_categories } from "@/lib/curd/crm-category";
import { crud_get_all_crm_industries } from "@/lib/curd/crm-industry";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";

// prepare data
const linked_in_company_sizes = [
  "1",
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10,000",
  "10,001",
];

// The crm companies filtering sheet component

interface Props {
  filters: Record<string, string>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

interface FiltersType {
  name: string;
  email: string;
  company_size: string;
  identification: string;
  location_global: string;
  location_country: string;
  phoneNumber: string;
  industry: string;
  category: string;
}

export default function CRMCompaniesPageFiltering({
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
      category: "",
      company_size: "",
      identification: "",
      industry: "",
      phoneNumber: "",
    },
    filters: filters,
    setFilters: setFilters,
  });

  // fetching filters data
  const { data, isFetching, refetch } = useFilteringFetch(
    {
      // categories
      categories: () =>
        crud_get_all_crm_company_categories({
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
        title="CRM Companies Filters"
        description="Filter companies by name, size, category..."
        open={open}
        isLoading={isFetching}
        setOpen={setOpen}
        handelShowResults={handleApplyFilters}
        handleClear={handleClear}
        isFiltered={isFiltered}
      >
        {/* name */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="name">Name</Label>
          <DebouncedInput
            id="name"
            placeholder="Company name"
            value={filterValues.name}
            onDebouncedValueChange={(e) => setFilterValue("name", e as string)}
          />
        </div>
        {/* size */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="size">Size</Label>
          <Select
            value={filterValues.company_size || "all"}
            onValueChange={(e) =>
              setFilterValue("company_size", e == "all" ? "" : e)
            }
          >
            <SelectTrigger id="size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {linked_in_company_sizes.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* email */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="email">Email</Label>
          <DebouncedInput
            id="email"
            placeholder="e.g contact@company.com"
            value={filterValues.email}
            onDebouncedValueChange={(e) => setFilterValue("email", e as string)}
          />
        </div>
        {/* phone */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="phone">Phone Number</Label>
          <DebouncedInput
            id="phone"
            placeholder="Number (Fax/Mobile/Whatsapp/Direct/Viber)"
            value={filterValues.phoneNumber}
            onDebouncedValueChange={(e) =>
              setFilterValue("phoneNumber", e as string)
            }
          />
        </div>
        {/* location country */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="country">Country</Label>
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
          <Label htmlFor="location">Location</Label>
          <DebouncedInput
            id="location"
            placeholder="e.g Algers"
            value={filterValues.location_global}
            onDebouncedValueChange={(e) =>
              setFilterValue("location_global", e as string)
            }
          />
        </div>

        {/* check if the work categories data is fetched how a combobox if not a simple input */}
        {data.categories && data.categories.length > 0 ? (
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="category">Category</Label>
            <FormQuickControlledComboboxComponent
              name="category"
              id="category"
              placeholder="Category"
              list={data.categories.map((e) => ({
                label: e.name,
                value: e.name,
              }))}
              value={filterValues.category}
              setValue={(e) => setFilterValue("category", e as string)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="category">Category</Label>
            <DebouncedInput
              id="category"
              placeholder="Category"
              value={filterValues.category}
              onDebouncedValueChange={(e) =>
                setFilterValue("category", e as string)
              }
            />
          </div>
        )}

        {/* check if the work industry data is fetched how a combobox if not a simple input */}
        {data.industries && data.industries.length > 0 ? (
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="industry">Industry</Label>
            <FormQuickControlledComboboxComponent
              name="industry"
              id="industry"
              placeholder="Industry field"
              list={data.industries.map((e) => ({
                label: e.name,
                value: e.name,
              }))}
              value={filterValues.industry}
              setValue={(e) => setFilterValue("industry", e as string)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2 mb-3">
            <Label htmlFor="industry">Industry</Label>
            <DebouncedInput
              id="industry"
              placeholder="Industry field"
              value={filterValues.industry}
              onDebouncedValueChange={(e) =>
                setFilterValue("industry", e as string)
              }
            />
          </div>
        )}

        {/* identification */}
        <div className="flex flex-col gap-2 mb-3">
          <Label htmlFor="identification">Identification</Label>
          <DebouncedInput
            id="identification"
            placeholder="TIN/CRN/TAX Code/Statistical Code"
            value={filterValues.identification}
            onDebouncedValueChange={(e) =>
              setFilterValue("identification", e as string)
            }
          />
        </div>
      </FilteringSheet>
    </>
  );
}
