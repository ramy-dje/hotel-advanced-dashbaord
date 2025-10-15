import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Reservations Page Protected Layout Component
export default async function ReservationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["reservation:read"], "/");

  return children;
}
