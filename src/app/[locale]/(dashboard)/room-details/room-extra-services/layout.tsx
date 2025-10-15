import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomExtraServices Page Protected Layout Component
export default async function RoomExtraServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_extra_services:read"], "/");

  return children;
}
