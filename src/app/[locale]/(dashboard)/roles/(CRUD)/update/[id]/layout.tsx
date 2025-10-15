import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Roles Update Page Protected Layout Component
export default async function RolesUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["role:read", "role:update"], "/");

  return children;
}
