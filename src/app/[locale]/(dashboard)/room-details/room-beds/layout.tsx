import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomBeds Page Protected Layout Component
export default async function RoomBedsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_bed:read"], "/");

  return children;
}
