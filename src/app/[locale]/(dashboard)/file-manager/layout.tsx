import ProtectServerPagePermissions from "@/server/protect-server-page";

// The File Manager Page Protected Layout Component
export default async function FileManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["room:read"], "/");

  return children;
}
