import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Roles Create Page Protected Layout Component
export default async function RolesCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["role:read", "role:create"], "/");

  return children;
}
