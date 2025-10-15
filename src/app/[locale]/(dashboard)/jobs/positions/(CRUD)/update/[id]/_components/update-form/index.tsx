import {
  UpdateJobValidationSchema,
  UpdateJobValidationSchemaType,
} from "./update-room-validation.schema";
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
import JobDepartmentInterface from "@/interfaces/job-department.interface";
import UpdateJob_MainInformation_Section from "./components/main-info.section";
import UpdateJob_Details_Section from "./components/details-info.section";
import { crud_update_job } from "@/lib/curd/job";
import JobInterface from "@/interfaces/job.interface";

interface Props {
  job: JobInterface;
  formSelectData: {
    departmentData: JobDepartmentInterface[];
  };
}
export default function UpdateJobFrom({ formSelectData, job }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<UpdateJobValidationSchemaType>({
    resolver: zodResolver(UpdateJobValidationSchema),

    defaultValues: {
      description: "",
      desired_profile_text: "",
      responsibilities_text: "",
      skills_text: "",
      expire: undefined,
      department: null,
      number_of_positions: 1,
    },
  });
  // router
  const router = useRouter();
  // hash
  const [hash] = useHash();

  // sections refs
  const section_main_info_ref = useRef<HTMLDivElement>(null);
  const position_details_ref = useRef<HTMLDivElement>(null);

  // set the loading
  useEffect(() => {
    methods.control._disableForm(isLoading);
  }, [isLoading]);

  useEffect(() => {
    // scroll to top
    methods.setFocus("department", { shouldSelect: true });
    window.scrollTo({ top: 0 });
  }, []);

  // set the old job data
  useEffect(() => {
    // set the old job data to the form
    if (job) {
      // main info
      methods.setValue("department", job.department?.id || null);
      methods.setValue("title", job.title);
      methods.setValue("description", job.description);
      methods.setValue("responsibilities_text", job.responsibilities_text);
      methods.setValue("skills_text", job.skills_text);
      methods.setValue("desired_profile_text", job.desired_profile_text);
      methods.setValue("expire", new Date(job.expire));
      methods.setValue("level", job.level);
      methods.setValue("number_of_positions", job.positions);
      methods.setValue("type", job.type);
      methods.setValue("location_state", job.locations.state);
      methods.setValue("location_city", job.locations.city);
      methods.setValue("location_address", job.locations.address || "");
    }
  }, []);

  // reset after the successful updating
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle update
  const handleUpdate = async (data: UpdateJobValidationSchemaType) => {
    if (!job) return;
    setIsLoading(true);
    try {
      // update the room
      await crud_update_job(job.id, {
        title: data.title,
        department: data.department || null,
        description: data.description,
        desired_profile_text: data.desired_profile_text,
        responsibilities_text: data.responsibilities_text,
        skills_text: data.skills_text,
        expire: data.expire,
        level: data.level,
        locations: {
          city: data.location_city || "",
          state: data.location_state || "",
          address: data.location_address || "",
        },
        positions: data.number_of_positions,
        type: data.type,
      });
      // to the positions page
      router.push("/jobs/positions");
      // tost
      toast.success("Position Updated Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      return;
    }

    setIsLoading(false);
  };

  // update

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleUpdate)}>
        <div className="w-full  min-h-screen">
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
              hash="#position-details"
              selected={hash == "#position-details"}
              ref={position_details_ref}
            >
              Position Details
            </CreationTabsTab>
          </CreationTabsContent>

          <FormProvider {...methods}>
            <CreationFormContent>
              {/* main info section */}
              <UpdateJob_MainInformation_Section
                ref={section_main_info_ref}
                id="#main-information"
              />

              <UpdateJob_Details_Section
                departments={formSelectData.departmentData}
                ref={position_details_ref}
                id="#position-details"
              />

              {/* <div className="mb-[5em]"></div> */}
            </CreationFormContent>
          </FormProvider>
        </div>
        <CreationFormFooterActions>
          <Button
            onClick={() => router.push("/jobs/positions")}
            disabled={isLoading}
            type="button"
            variant="outline"
          >
            {/* Save as draft */}
            Cancel
          </Button>
          <Button disabled={isLoading} isLoading={isLoading} type="submit">
            Update Position
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
