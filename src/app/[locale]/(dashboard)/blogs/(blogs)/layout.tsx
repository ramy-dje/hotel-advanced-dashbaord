import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Blogs Page Protected Layout Component
export default async function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog:read"], "/");

  return children;
}
