import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food Ingredient Page Protected Layout Component
export default async function FoodIngredientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(["food_ingredient:read"], "/");

  return children;
}
