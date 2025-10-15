import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food Types Page Protected Layout Component
export default async function FoodTypesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["food_type:read"], "/");

  return children;
}
