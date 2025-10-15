import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomIncludes Page Protected Layout Component
export default async function RoomIncludesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_include:read"], "/");

  return children;
}
