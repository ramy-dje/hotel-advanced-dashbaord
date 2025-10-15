import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Rooms Page Protected Layout Component
export default async function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room:read"], "/");

  return children;
}
