import ProtectServerPagePermissions from "@/server/protect-server-page";

// The CreateDestination Page Protected Layout Component
export default async function CreateDestinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["destination:read", "destination:create"],
    "/"
  );

  return children;
}
