import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomFeatures Page Protected Layout Component
export default async function RoomFeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_feature:read"], "/");

  return children;
}
