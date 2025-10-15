import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Update Room Page Protected Layout Component
export default async function UpdateRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room:read", "room:update"], "/");

  return children;
}
