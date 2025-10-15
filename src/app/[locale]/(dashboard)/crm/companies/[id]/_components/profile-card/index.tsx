import { Card } from "@/components/ui/card";
import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import CompanyProfileCardHeader from "./header";
import CompanyProfileCardContent from "./content";

interface Props {
  company: CRMCompanyInterface;
}

// The CRM Company Profile Card Components

export default function CompanyProfileCard({ company }: Props) {
  return (
    <Card className="w-full flex flex-col gap-8 min-h-[10em] p-2 lg:p-4 rounded-3xl shadow-sm">
      {/* header */}
      <CompanyProfileCardHeader company={company} />
      {/* info */}
      <CompanyProfileCardContent company={company} />
    </Card>
  );
}
