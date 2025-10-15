import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Job Submissions Page Protected Layout Component
export default async function JobSubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["job_submission:read"], "/");

  return children;
}
