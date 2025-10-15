import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Deleted Rooms Page Protected Layout Component
export default async function DeletedRoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room:read", "room:delete"], "/");

  return children;
}
