import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Taxes Page Protected Layout Component
export default async function TaxesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["blog_category:read"], "/");

  return children;
}
