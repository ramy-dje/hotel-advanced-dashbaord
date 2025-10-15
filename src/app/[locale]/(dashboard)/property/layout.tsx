import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Property Page Protected Layout Component
export default async function PropertyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["property:read"], "/");

  return children;
}
