import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Destinations Page Protected Layout Component
export default async function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["destination:read"], "/");

  return children;
}
