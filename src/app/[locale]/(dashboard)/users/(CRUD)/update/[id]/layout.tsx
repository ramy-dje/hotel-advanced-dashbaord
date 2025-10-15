import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Users Update Page Protected Layout Component
export default async function UsersUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["user:read", "user:update"], "/");

  return children;
}
