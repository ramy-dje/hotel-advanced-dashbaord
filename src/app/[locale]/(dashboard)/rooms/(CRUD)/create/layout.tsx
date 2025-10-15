import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Create Room Page Protected Layout Component
export default async function CreateRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room:read", "room:create"], "/");

  return children;
}
