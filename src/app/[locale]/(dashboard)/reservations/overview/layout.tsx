import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Reservations Overview Page Protected Layout Component
export default async function ReservationsOverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["reservation:read"], "/");

  return children;
}
