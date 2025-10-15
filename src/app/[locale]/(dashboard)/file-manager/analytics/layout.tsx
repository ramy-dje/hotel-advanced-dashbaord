import ProtectServerPagePermissions from "@/server/protect-server-page";

// The File Manager Page Protected Layout Component
export default async function FileManagerAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["file_manager_analytics:read"], "/");

  return children;
}
