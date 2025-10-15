import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InlineAlert from "@/components/ui/inline-alert";
import { RiSparkling2Fill } from "react-icons/ri";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Add this to your schema validation (zod or similar)
// import { EnergyDetailsValidationSchema } from "./energy-details.schema";

interface EnergyDetailsFormData {
  energyClass: string;
  assessmentYear: number;
  coolingSystemType: string;
  insulationQuality: "Good" | "Moderate" | "Poor";
  ventilationSystem: "Natural" | "Mechanical" | "MVHR";
  co2Emissions: string;
  certificateNumber: string;
  certificateExpiryDate: string;
  epcReportFile: FileList | null;
  recommendations: string;
}

export default function EnergyDetailsPopup() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EnergyDetailsFormData>({
    // resolver: zodResolver(EnergyDetailsValidationSchema),
    defaultValues: {
      energyClass: "",
      assessmentYear: new Date().getFullYear(),
      coolingSystemType: "",
      insulationQuality: "Moderate",
      ventilationSystem: "Natural",
      co2Emissions: "",
      certificateNumber: "",
      certificateExpiryDate: "",
      recommendations: "",
    }
  });

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const energyClasses = [
    { value: "A+", label: "A+ (Most efficient)", color: "bg-green-600" },
    { value: "A", label: "A", color: "bg-green-500" },
    { value: "B", label: "B", color: "bg-yellow-500" },
    { value: "C", label: "C", color: "bg-yellow-400" },
    { value: "D", label: "D", color: "bg-orange-500" },
    { value: "E", label: "E", color: "bg-orange-400" },
    { value: "F", label: "F", color: "bg-red-500" },
    { value: "G", label: "G (Least efficient)", color: "bg-red-600" },
  ];

  const handleCreate = async (data: EnergyDetailsFormData) => {
    setIsLoading(true);
    setError("");

    try {
      // Create form data including the file
      const formData = new FormData();
      formData.append("energyClass", data.energyClass);
      formData.append("assessmentYear", data.assessmentYear.toString());
      formData.append("coolingSystemType", data.coolingSystemType);
      formData.append("insulationQuality", data.insulationQuality);
      formData.append("ventilationSystem", data.ventilationSystem);
      formData.append("co2Emissions", data.co2Emissions);
      formData.append("certificateNumber", data.certificateNumber);
      formData.append("certificateExpiryDate", data.certificateExpiryDate);
      formData.append("recommendations", data.recommendations);
      
      if (data.epcReportFile && data.epcReportFile[0]) {
        formData.append("epcReport", data.epcReportFile[0]);
      }

      // Submit logic here (API call)
      // await api.submitEnergyDetails(formData);
      
      setOpen(false);
      toast.success("Energy details saved successfully");
    } catch (err) {
      setError("Failed to save energy details. Please try again.");
    }

    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="underline m-0 p-0 h-auto">
          <RiSparkling2Fill />&nbsp;Manage More
        </Button>
      </DialogTrigger>

      <DialogContent
        preventOutsideClose={isLoading}
        closeButtonDisabled={isLoading}
        className="max-h-[80vh] overflow-y-auto w-full max-w-3xl flex flex-col "
      >
        <form onSubmit={handleSubmit(handleCreate)}>
          <DialogHeader>
            <DialogTitle>Energy Performance Details</DialogTitle>
          </DialogHeader>

          <div className="col-span-full grid gap-4 md:grid-cols-2 xl:col-span-8 xl:gap-5 mb-6 mt-6">
            {/* 1. Energy Class Dropdown */}
           

            {/* 2. Year of Assessment */}
            <div className="grid gap-2">
              <Label htmlFor="assessmentYear">Year of Assessment</Label>
              <Input
                id="assessmentYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                {...register("assessmentYear", { 
                  required: true,
                  valueAsNumber: true 
                })}
              />
              {errors.assessmentYear && (
                <InlineAlert type="error">Assessment year is required</InlineAlert>
              )}
            </div>

            {/* 3. Cooling System Type */}
            <div className="grid gap-2">
              <Label htmlFor="coolingSystemType">Cooling System Type</Label>
              <Input
                id="coolingSystemType"
                placeholder="e.g., Central AC, Split Units, etc."
                {...register("coolingSystemType")}
              />
            </div>

            {/* 4. Insulation Quality */}
            <div className="grid gap-2">
              <Label htmlFor="insulationQuality">Insulation Quality</Label>
              <Select
                {...register("insulationQuality")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select insulation quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Ventilation System */}
            <div className="grid gap-2">
              <Label htmlFor="ventilationSystem">Ventilation System</Label>
              <Select
                {...register("ventilationSystem")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ventilation system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Natural">Natural</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="MVHR">MVHR (Heat Recovery)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. CO₂ Emissions Index */}
            <div className="grid gap-2">
              <Label htmlFor="co2Emissions">CO₂ Emissions Index</Label>
              <Input
                id="co2Emissions"
                placeholder="e.g., 23 kgCO₂/m²a"
                {...register("co2Emissions")}
              />
            </div>

            {/* 7. Energy Certificate Number */}
            <div className="grid gap-2">
              <Label htmlFor="certificateNumber">Energy Certificate Number</Label>
              <Input
                id="certificateNumber"
                placeholder="Enter certificate number"
                {...register("certificateNumber")}
              />
            </div>

            {/* 8. Energy Certificate Expiry Date */}
            <div className="grid gap-2">
              <Label htmlFor="certificateExpiryDate">Certificate Expiry Date</Label>
              <Input
                id="certificateExpiryDate"
                type="date"
                {...register("certificateExpiryDate")}
              />
            </div>

            {/* 9. EPC Report Upload */}
            <div className="grid gap-2">
              <Label htmlFor="epcReportFile">EPC Report (PDF)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="epcReportFile"
                  type="file"
                  accept=".pdf"
                  {...register("epcReportFile")}
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <span className="text-sm truncate max-w-[150px]">
                    {selectedFile.name}
                  </span>
                )}
              </div>
            </div>

            {/* 10. Recommendations for Improvement */}
            <div className="grid gap-2 col-span-full">
              <Label htmlFor="recommendations">Recommendations for Improvement</Label>
              <Textarea
                id="recommendations"
                placeholder="Suggestions to improve energy efficiency..."
                {...register("recommendations")}
                rows={3}
              />
            </div>
            
            {error && <InlineAlert type="error">{error}</InlineAlert>}
          </div>

          <DialogFooter className="justify-end">
            <DialogClose asChild>
              <Button
                className="w-[6em]"
                disabled={isLoading}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="w-[6em]"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}