import ProtectServerPagePermissions from "@/server/protect-server-page";

// The Food UpdateMenu Page Protected Layout Component
export default async function FoodUpdateMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // protect this page
  await ProtectServerPagePermissions(
    ["food_menu:read", "food_menu:update"],
    "/"
  );

  return children;
}
