import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Update CRM Company Page Protected Layout Component
export default async function UpdateCRMCompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["crm_company:read", "crm_company:update"],
    "/"
  );

  return children;
}
