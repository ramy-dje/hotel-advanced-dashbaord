"use client";
import {
  CreationFormSection,
  CreationFormSectionContent,
  CreationFormSectionInfo,
  CreationFormSectionInfoDescription,
  CreationFormSectionInfoTitle,
} from "@/components/creation-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forwardRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { CreateJobValidationSchemaType } from "../create-room-validation.schema";
import InlineAlert from "@/components/ui/inline-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobDepartmentInterface from "@/interfaces/job-department.interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HiOutlineCalendar } from "react-icons/hi";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Create Job Details Info Section

interface Props {
  id: string;
  departments: JobDepartmentInterface[];
}

const CreateJob_Details_Section = forwardRef<HTMLDivElement, Props>(
  ({ id, departments }, ref) => {
    const {
      control,
      formState: { errors, disabled },
      register,
    } = useFormContext<CreateJobValidationSchemaType>();
    // logic

    // department controller
    const department_controller = useController({
      control,
      name: "department",
    });

    // expire controller
    const expire_controller = useController({
      control,
      name: "expire",
    });

    return (
      <CreationFormSection ref={ref} id={id}>
        <CreationFormSectionInfo>
          <CreationFormSectionInfoTitle>
            Position Details
          </CreationFormSectionInfoTitle>
          <CreationFormSectionInfoDescription>
            The position department, type, level and other details
          </CreationFormSectionInfoDescription>
        </CreationFormSectionInfo>
        <CreationFormSectionContent>
          {/* job department */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={department_controller.field.value || "no"}
              onValueChange={(e) =>
                department_controller.field.onChange(e == "no" ? null : e)
              }
              defaultValue={"no"}
            >
              <SelectTrigger
                disabled={disabled}
                id="department"
                className="w-auto"
              >
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no" key="no">
                  No Department
                </SelectItem>
                {departments.map((department) => (
                  <SelectItem value={department.id}>
                    {department.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors?.department ? (
              <InlineAlert type="error">
                {errors.department.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job type */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              type="text"
              disabled={disabled}
              placeholder="ex. CDD,CDI.."
              {...register("type", { required: true })}
            />
            {errors?.type ? (
              <InlineAlert type="error">{errors.type.message}</InlineAlert>
            ) : null}
          </div>
          {/* job level */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              type="text"
              disabled={disabled}
              placeholder="ex. Senior,Junior.."
              {...register("level", { required: true })}
            />
            {errors?.level ? (
              <InlineAlert type="error">{errors.level.message}</InlineAlert>
            ) : null}
          </div>
          {/* job positions */}
          <div className="flex flex-col col-span-2 md:col-span-1 gap-2">
            <Label htmlFor="positions">Open Positions</Label>
            <Input
              id="positions"
              min={1}
              defaultValue={1}
              type="number"
              disabled={disabled}
              placeholder="Open Positions"
              {...register("number_of_positions", {
                required: true,
                valueAsNumber: true,
              })}
            />
            {errors?.number_of_positions ? (
              <InlineAlert type="error">
                {errors.number_of_positions.message}
              </InlineAlert>
            ) : null}
          </div>
          {/* job expire */}
          <div className="flex flex-col col-span-2 gap-2">
            <Label htmlFor="expire">Expiration Date</Label>
            <Popover>
              <PopoverTrigger id="expire" asChild>
                <Button
                  id="date"
                  disabled={disabled}
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full gap-2 justify-start text-left font-normal",
                    expire_controller.field.value && "text-muted-foreground"
                  )}
                >
                  <HiOutlineCalendar className="size-4" />
                  {expire_controller.field.value ? (
                    format(expire_controller.field.value, "LLL dd, y")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  // initialFocus
                  selected={expire_controller.field.value}
                  mode="single"
                  onSelect={(r: any) => {
                    expire_controller.field.onChange(r as any);
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            {errors?.expire ? (
              <InlineAlert type="error">{errors.expire.message}</InlineAlert>
            ) : null}
          </div>
        </CreationFormSectionContent>
      </CreationFormSection>
    );
  }
);

export default CreateJob_Details_Section;
