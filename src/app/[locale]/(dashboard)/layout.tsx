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

  return (
    <div>
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
    </div>
  );
}
