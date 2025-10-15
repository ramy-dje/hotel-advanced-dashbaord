import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Update CRM Contacts Page Protected Layout Component
export default async function UpdateCRMContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["crm_contacts:read", "crm_contacts:update"],
    "/"
  );

  return children;
}
