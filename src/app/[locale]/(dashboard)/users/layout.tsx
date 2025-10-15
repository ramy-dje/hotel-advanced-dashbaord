import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Users Page Protected Layout Component
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["user:read"], "/");

  return children;
}
