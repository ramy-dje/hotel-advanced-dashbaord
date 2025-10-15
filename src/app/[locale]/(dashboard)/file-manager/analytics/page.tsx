import {
  PageLayout,
  PageLayoutHeader,
  PageLayoutHeaderNameAndBreadcrumbs,
  PageLayoutHeaderNameAndBreadcrumbsTitle,
} from "@/components/page-layout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/routing";
import FileManagerAnalyticsCard from "./_components/analytics_card";

export default function FileManagerAnalyticsPage() {
  return (
    <PageLayout>
      {/* header of the page */}
      <PageLayoutHeader>
        {/* name and breadcrumbs */}
        <PageLayoutHeaderNameAndBreadcrumbs>
          <PageLayoutHeaderNameAndBreadcrumbsTitle className="text-2xl font-semibold">
            File Manager
          </PageLayoutHeaderNameAndBreadcrumbsTitle>
          {/* breadcrumbs */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="size-1 block rounded-full bg-muted-foreground/50" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/file-manager">File Manager</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <span className="size-1 block rounded-full bg-muted-foreground/50" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageLayoutHeaderNameAndBreadcrumbs>
      </PageLayoutHeader>
      <FileManagerAnalyticsCard />
    </PageLayout>
  );
}
