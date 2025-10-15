import ProtectServerPagePermissions from "@/server/protect-server-page";

// The UpdateDestination Page Protected Layout Component
export default async function UpdateDestinationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["destination:read", "destination:update"],
    "/"
  );

  return children;
}
