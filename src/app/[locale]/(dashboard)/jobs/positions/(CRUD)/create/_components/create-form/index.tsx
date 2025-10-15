import {
  CreateJobValidationSchema,
  CreateJobValidationSchemaType,
} from "./create-room-validation.schema";
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
import CreateJob_MainInformation_Section from "./components/main-info.section";
import CreateJob_Details_Section from "./components/details-info.section";
import { crud_create_job } from "@/lib/curd/job";

interface Props {
  formSelectData: {
    departmentData: JobDepartmentInterface[];
  };
}
export default function CreateJobFrom({ formSelectData }: Props) {
  // loading
  const [isLoading, setIsLoading] = useState(false);
  // form
  const methods = useForm<CreateJobValidationSchemaType>({
    resolver: zodResolver(CreateJobValidationSchema),

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

  // reset after the successful creation
  useEffect(() => {
    if (!methods.formState.isSubmitSuccessful) return;
    // // resetting the form
    methods.reset();
  }, [methods.formState.isSubmitSuccessful]);

  // handle create
  const handleCreate = async (data: CreateJobValidationSchemaType) => {
    setIsLoading(true);
    try {
      // create the room
      await crud_create_job({
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
      toast.success("Position Created Successfully");
    } catch (err) {
      setIsLoading(false);
      toast.error("Something went wrong");
      throw err;
    }

    setIsLoading(false);
  };

  return (
    <div className="relative">
      <form onSubmit={methods.handleSubmit(handleCreate)}>
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
              <CreateJob_MainInformation_Section
                // departments={formSelectData.departmentData}
                ref={section_main_info_ref}
                id="#main-information"
              />

              <CreateJob_Details_Section
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
            Create Position
          </Button>
        </CreationFormFooterActions>
      </form>
    </div>
  );
}
