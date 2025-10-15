import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Job Department Page Protected Layout Component
export default async function JobDepartmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["job_department:read"], "/");

  return children;
}
