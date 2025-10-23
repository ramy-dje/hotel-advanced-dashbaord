import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Rate Seasons Page Protected Layout Component
export default async function RateSeasonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog_category:read"], "/");

  return children;
}
