import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Create CRM Contacts Page Protected Layout Component
export default async function CreateCRMContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["crm_contacts:read", "crm_contacts:create"],
    "/"
  );

  return children;
}
