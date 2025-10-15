import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Job Update Position Page Protected Layout Component
export default async function JobUpdatePositionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["job_position:read", "job_position:update"],
    "/"
  );

  return children;
}
