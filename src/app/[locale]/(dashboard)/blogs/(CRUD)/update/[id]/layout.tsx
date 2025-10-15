import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Blogs Update Page Protected Layout Component
export default async function BlogsUpdateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog:read", "blog:update"], "/");

  return children;
}
