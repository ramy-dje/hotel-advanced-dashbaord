import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomTypes Page Protected Layout Component
export default async function RoomTypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_type:read"], "/");

  return children;
}
