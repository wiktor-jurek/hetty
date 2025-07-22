"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Eye, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration - this will come from the database
const mockRuns = [
  {
    id: "250722_223535",
    runId: "250722_223535",
    date: "2024-07-25",
    status: "completed",
    totalUnusedFields: 150,
    totalUnusedExplores: 24,
    projectsWithGitIssues: 2,
    contentBloatScore: 65,
  },
  {
    id: "240715_184320",
    runId: "240715_184320", 
    date: "2024-07-15",
    status: "completed",
    totalUnusedFields: 162,
    totalUnusedExplores: 28,
    projectsWithGitIssues: 3,
    contentBloatScore: 68,
  },
  {
    id: "240708_091245",
    runId: "240708_091245",
    date: "2024-07-08", 
    status: "completed",
    totalUnusedFields: 175,
    totalUnusedExplores: 30,
    projectsWithGitIssues: 4,
    contentBloatScore: 72,
  },
  {
    id: "240701_143012",
    runId: "240701_143012",
    date: "2024-07-01",
    status: "processing",
    totalUnusedFields: null,
    totalUnusedExplores: null,
    projectsWithGitIssues: null,
    contentBloatScore: null,
  },
  {
    id: "240624_210847",
    runId: "240624_210847",
    date: "2024-06-24",
    status: "failed",
    totalUnusedFields: null,
    totalUnusedExplores: null,
    projectsWithGitIssues: null,
    contentBloatScore: null,
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
    case "processing":
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Processing</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function getBloatScoreIndicator(score: number | null) {
  if (score === null) return null;
  
  if (score >= 70) {
    return <TrendingUp className="h-4 w-4 text-red-500" />;
  } else if (score >= 40) {
    return <TrendingDown className="h-4 w-4 text-yellow-500" />;
  } else {
    return <TrendingDown className="h-4 w-4 text-green-500" />;
  }
}

export default function HenryRunsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Henry Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Historical overview of your Looker instance health analysis runs
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRuns.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Analysis</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRuns[0]?.date}</div>
            <p className="text-xs text-muted-foreground">
              {mockRuns[0]?.totalUnusedFields} unused fields found
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bloat Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                mockRuns
                  .filter(run => run.contentBloatScore !== null)
                  .reduce((sum, run) => sum + (run.contentBloatScore || 0), 0) /
                mockRuns.filter(run => run.contentBloatScore !== null).length
              )}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across completed runs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRuns[0]?.projectsWithGitIssues || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Projects with Git issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Runs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Run History</CardTitle>
          <CardDescription>
            Complete history of Henry analysis runs for your Looker instance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Run ID</TableHead>
                <TableHead>Run Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Unused Fields</TableHead>
                <TableHead className="text-right">Unused Explores</TableHead>
                <TableHead className="text-right">Git Issues</TableHead>
                <TableHead className="text-right">Bloat Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRuns.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-sm">{run.runId}</TableCell>
                  <TableCell>{new Date(run.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(run.status)}</TableCell>
                  <TableCell className="text-right">
                    {run.totalUnusedFields !== null ? run.totalUnusedFields : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {run.totalUnusedExplores !== null ? run.totalUnusedExplores : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {run.projectsWithGitIssues !== null ? run.projectsWithGitIssues : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {run.contentBloatScore !== null ? `${run.contentBloatScore}%` : "—"}
                      {getBloatScoreIndicator(run.contentBloatScore)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {run.status === "completed" ? (
                      <Link href="/dashboard/henry-dashboard">
                        <Button variant="outline" size="sm">
                          View Report
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        {run.status === "processing" ? "Processing..." : "Unavailable"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 