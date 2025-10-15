import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food CreateDish Page Protected Layout Component
export default async function FoodCreateDishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["food_dish:read", "food_dish:create"],
    "/"
  );

  return children;
}
