import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food Dishes Page Protected Layout Component
export default async function FoodDishesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["food_dish:read"], "/");

  return children;
}
