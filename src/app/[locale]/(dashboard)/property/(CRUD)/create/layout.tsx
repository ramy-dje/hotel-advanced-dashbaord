import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Create Room Page Protected Layout Component
export default async function CreateRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["property:read", "property:create"], "/");

  return children;
}
