import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Create CRM Company Page Protected Layout Component
export default async function CreateCRMCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["crm_company:read", "crm_company:create"],
    "/"
  );

  return children;
}
