import ProtectServerPagePermissions from "@/server/protect-server-page";

// The CRM Contacts Page Protected Layout Component
export default async function CRMContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["crm_contacts:read"], "/");

  return children;
}
