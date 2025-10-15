import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Floor Page Protected Layout Component
export default async function FloorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["floor:read"], "/");

  return children;
}
