import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food Menus Page Protected Layout Component
export default async function FoodMenusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["food_menu:read"], "/");

  return children;
}
