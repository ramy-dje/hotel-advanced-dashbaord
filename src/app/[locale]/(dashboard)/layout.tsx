import DashboardHeader from "@/components/header";
import DashboardSidebar from "@/components/sidebar";
import { getServerAuth } from "@/server/auth";
import { redirect } from "@/i18n/routing";
import AccessPermissionsProvider from "@/providers/access-permissions.provider";
import { cachedGetServerPermissions } from "@/utils/permissions-utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// the dashboard layout

interface Props {
  children: React.ReactNode;
}

// The Dashboard layout
export default async function DashboardLayout({ children }: Props) {
  // check the auth of this user
  const user = await getServerAuth();

  // if the user doesn't exist
  if (!user) {
    // redirect to the login page
    return redirect("/login");
  }

  // check the user permissions
  const access_info = await cachedGetServerPermissions();

  if (!access_info) {
    // redirect to the login page
    return redirect("/login");
  }

  // check if the user's account is active
  if (!access_info.active) {
    // if the user's account isn't active
    return redirect("https://hotelralf.com");
  }

  // check if the user has the required permission to access the dashboard
  const have_access = access_info.permissions.includes("panel:access");

  // if the user hasn't the required permission to access the dashboard redirect him to the website
  if (!have_access) {
    return redirect("https://hotelralf.com");
  }

  return (
    <AccessPermissionsProvider access_info={access_info}>
      <main className="w-full  min-h-screen flex-grow">
        {/* sidebar */}
        <aside className="bottom-0 start-0 h-full w-[270px] border-r border-border bg-background 2xl:w-72 fixed hidden xl:block">
          {/* sidebar here */}
          <DashboardSidebar />
        </aside>

        {/* the pages content */}
        <div className="flex w-full flex-col  xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
          {/* Navbar (Header) */}
          <DashboardHeader />
          <div className="w-full flex flex-grow flex-col p-8 xl:px-6 xl:py-4 2xl:px-8 2x:py-6">
            {/* // pages here */}
            {children}
          </div>
        </div>
      </main>
    </AccessPermissionsProvider>
  );
}
