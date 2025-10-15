import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food CreateMenu Page Protected Layout Component
export default async function FoodCreateMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["food_menu:read", "food_menu:create"],
    "/"
  );

  return children;
}
