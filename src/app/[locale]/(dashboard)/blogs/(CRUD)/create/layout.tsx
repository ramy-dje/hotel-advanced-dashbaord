import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Blogs Create Page Protected Layout Component
export default async function BlogsCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog:read", "blog:create"], "/");

  return children;
}
