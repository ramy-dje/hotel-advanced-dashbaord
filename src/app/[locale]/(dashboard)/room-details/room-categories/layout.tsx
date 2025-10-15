import ProtectServerPagePermissions from "@/server/protect-server-page";

// The RoomCategories Page Protected Layout Component
export default async function RoomCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room_category:read"], "/");

  return children;
}
