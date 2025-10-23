import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Roles Page Protected Layout Component
export default async function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["role:read"], "/");

  return children;
}
