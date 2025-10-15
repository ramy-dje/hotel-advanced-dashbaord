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
import FileManagerActions from "./_components/actions";
import FileManagerKpis from "./_components/file-manager-kpis";
import FileManagerTable from "./_components/table";

export type FileManagerFilters = {
  search?: string;
  folderId?: string;
  itemType?: string;
  fileType?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: string;
  fileTypes?: string;
};

export default async function FileManagerPage(props: {
  searchParams?: Promise<FileManagerFilters>;
}) {
  const searchParams = await props.searchParams;
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
                <BreadcrumbPage>File Manager</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </PageLayoutHeaderNameAndBreadcrumbs>

        {/* actions */}
        <FileManagerActions />
      </PageLayoutHeader>
      {/* kpis section */}
      <FileManagerKpis />
      {/* the table header and table section */}
      <FileManagerTable filters={searchParams} />
    </PageLayout>
  );
}
