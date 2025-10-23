import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Fees Page Protected Layout Component
export default async function FeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog_category:read"], "/");

  return children;
}
