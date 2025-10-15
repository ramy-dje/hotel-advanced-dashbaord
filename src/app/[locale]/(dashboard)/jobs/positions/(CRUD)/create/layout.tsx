import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Job Create Position Page Protected Layout Component
export default async function JobCreatePositionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["job_position:read", "job_position:create"],
    "/"
  );

  return children;
}
