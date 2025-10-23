import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Rate Categories Page Protected Layout Component
export default async function RateCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog_category:read"], "/");

  return children;
}
