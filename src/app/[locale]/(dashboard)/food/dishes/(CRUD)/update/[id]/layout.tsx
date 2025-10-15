import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food UpdateDish Page Protected Layout Component
export default async function FoodUpdateDishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["food_dish:read", "food_dish:update"],
    "/"
  );

  return children;
}
