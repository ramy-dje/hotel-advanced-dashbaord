import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Job Positions Page Protected Layout Component
export default async function JobPositionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["job_position:read"], "/");

  return children;
}
