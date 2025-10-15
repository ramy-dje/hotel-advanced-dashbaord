import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Users Create Page Protected Layout Component
export default async function UsersCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["user:read", "user:create"], "/");

  return children;
}
