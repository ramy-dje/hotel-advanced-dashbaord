import ProtectServerPagePermissions from "@/server/protect-server-page";

// The CRM Companies Page Protected Layout Component
export default async function CRMCompaniesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["crm_company:read"], "/");

  return children;
}
