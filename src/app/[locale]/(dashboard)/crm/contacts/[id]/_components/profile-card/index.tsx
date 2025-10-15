import { Card } from "@/components/ui/card";
import CRMContactInterface from "@/interfaces/crm-contact.interface";
import ContactProfileCardHeader from "./header";
import ContactProfileCardContent from "./content";

interface Props {
  contact: CRMContactInterface;
}

// The CRM Contact Profile Card Components

export default function ContactProfileCard({ contact }: Props) {
  return (
    <Card className="w-full flex flex-col gap-8 min-h-[10em] p-2 lg:p-4 rounded-3xl shadow-sm">
      {/* header */}
      <ContactProfileCardHeader contact={contact} />

      {/* info */}
      <ContactProfileCardContent contact={contact} />
    </Card>
  );
}
