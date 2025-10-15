"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import React from "react";

import QuickAccess from "./quick-access";
import StorageOverview from "./storage-overview";
import StorageByType from "./storage-by-type";
import RecentActivity from "./recent-activity";
import FileManagerKpis from "../../_components/file-manager-kpis";

export default function FileManagerAnalyticsCard() {
  return (
    <section
      aria-label="File Manager Overview"
      className="w-full grid grid-cols-1 gap-4"
    >
      <FileManagerKpis />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Card>
            <CardHeader className="items-center space-y-0.5">
              <CardTitle className="w-full text-lg">Storage Usage</CardTitle>
              <CardDescription className="w-full text-xs font-medium text-foreground/60">
                Storage usage over time and by file type
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <StorageOverview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="w-full text-lg">Quick Access</CardTitle>
                <CardDescription className="w-full text-xs font-medium text-foreground/60">
                  Your frequently accessed files and folders
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <QuickAccess />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3 h-fit">
          <Card>
            <CardHeader className="items-center space-y-0.5">
              <CardTitle className="w-full text-lg">
                Storage by File Type
              </CardTitle>
              <CardDescription className="w-full text-xs font-medium text-foreground/60">
                Breakdown of storage usage by file type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StorageByType />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
              <CardDescription>
                Timeline of your recently uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <RecentActivity />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
