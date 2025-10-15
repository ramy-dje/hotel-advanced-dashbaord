"use client";
import useAccess from "@/hooks/use-access";
import CRMCompaniesAnalyticsCard from "./_components/companies-analytics";
import CRMContactsAnalyticsCard from "./_components/contacts-analytics";

export default function Home() {
  const { has } = useAccess();
  return (
    <div className="w-full flex flex-col gap-8">
      {/* CRM Contacts analytics part (With Permissions) */}
      {has(["analytics_crm_contacts:read"]) ? (
        <CRMContactsAnalyticsCard />
      ) : null}
      {/* CRM Companies analytics part (With Permissions) */}
      {has(["analytics_crm_companies:read"]) ? (
        <CRMCompaniesAnalyticsCard />
      ) : null}
    </div>
  );
}
