import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Blogs Tags Page Protected Layout Component
export default async function BlogsTagsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog_tag:read"], "/");

  return children;
}
