"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  Database, 
  GitBranch, 
  Search, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  ArrowRight,
  Eye,
  Settings,
  FileText
} from "lucide-react";
import Link from "next/link";


// Mock data for the specific run - this will come from the database
const mockRunData = {
  runId: "250722_223535",
  date: "2024-07-25",
  status: "completed",
  totalUnusedFields: 150,
  totalUnusedExplores: 24,
  projectsWithGitIssues: 2,
  contentBloatScore: 65,
};

const mockUnusedContentByModel = [
  { model: "dna_legal", unusedFields: 97, totalFields: 323 },
  { model: "living_dna", unusedFields: 45, totalFields: 156 },
  { model: "warehouse_general", unusedFields: 8, totalFields: 89 },
];

const mockExploreStatus = [
  { name: "Used", value: 16, color: "#10b981" },
  { name: "Unused", value: 24, color: "#ef4444" },
];

const mockMostBloatedExplores = [
  { explore: "quote_drop_off", model: "dna_legal", unusedFields: 24, totalFields: 1087, percentage: 2.2 },
  { explore: "account_converted_drop_off_private", model: "dna_legal", unusedFields: 22, totalFields: 764, percentage: 2.9 },
  { explore: "account_converted_drop_off", model: "dna_legal", unusedFields: 19, totalFields: 767, percentage: 2.5 },
  { explore: "invoices", model: "dna_legal", unusedFields: 17, totalFields: 323, percentage: 5.3 },
  { explore: "user_targets_private", model: "dna_legal", unusedFields: 17, totalFields: 482, percentage: 3.5 },
];

export default function DashboardPage() {
  const runId = "250722_223535"; // Using fixed run ID since we removed dynamic routing

  const healthScore = Math.round(100 - mockRunData.contentBloatScore);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Analysis overview for run {runId} • {new Date(mockRunData.date).toLocaleDateString()}
          </p>
        </div>
        <Link href="/dashboard/henry-runs">
          <Button variant="outline">← Back to Runs</Button>
        </Link>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Health</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockRunData.projectsWithGitIssues}</div>
            <p className="text-xs text-muted-foreground">
              Projects with Git issues
            </p>
            <div className="flex items-center mt-2">
              <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
              <span className="text-xs">Needs attention</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Model Health</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockRunData.totalUnusedExplores}</div>
            <p className="text-xs text-muted-foreground">
              Unused explores across models
            </p>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-xs">High cleanup potential</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Explore Health</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mockRunData.totalUnusedFields}</div>
            <p className="text-xs text-muted-foreground">
              Total unused fields found
            </p>
            <div className="flex items-center mt-2">
              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="text-xs">Moderate bloat</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Bloat Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{mockRunData.contentBloatScore}%</div>
            <p className="text-xs text-muted-foreground">
              Unused content proportion
            </p>
            <Progress value={mockRunData.contentBloatScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Visualizations Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Unused Content Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Unused Content by Model</CardTitle>
            <CardDescription>Number of unused fields per model</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockUnusedContentByModel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="model" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="unusedFields" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Explore Status */}
        <Card>
          <CardHeader>
            <CardTitle>Explore Usage Status</CardTitle>
            <CardDescription>Proportion of used vs unused explores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockExploreStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockExploreStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Bloated Explores Table */}
      <Card>
        <CardHeader>
          <CardTitle>Most Bloated Explores</CardTitle>
          <CardDescription>
            Top explores with the highest number of unused fields
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Explore</TableHead>
                <TableHead>Model</TableHead>
                <TableHead className="text-right">Unused Fields</TableHead>
                <TableHead className="text-right">Total Fields</TableHead>
                <TableHead className="text-right">Unused %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMostBloatedExplores.map((explore, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{explore.explore}</TableCell>
                  <TableCell>{explore.model}</TableCell>
                  <TableCell className="text-right text-red-600 font-medium">
                    {explore.unusedFields}
                  </TableCell>
                  <TableCell className="text-right">{explore.totalFields}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={explore.percentage > 5 ? "destructive" : "secondary"}>
                      {explore.percentage}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/henry-projects">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Project Insights
                <ArrowRight className="h-4 w-4 ml-auto" />
              </CardTitle>
              <CardDescription>
                Analyze project-level configuration issues and Git connection problems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {mockRunData.projectsWithGitIssues} projects need attention
                </span>
                <Badge variant="outline">View Details</Badge>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/henry-models">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Model Insights
                <ArrowRight className="h-4 w-4 ml-auto" />
              </CardTitle>
              <CardDescription>
                Review model health and identify unused explores for cleanup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {mockRunData.totalUnusedExplores} unused explores found
                </span>
                <Badge variant="outline">View Details</Badge>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/dashboard/henry-explores">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Explore Insights
                <ArrowRight className="h-4 w-4 ml-auto" />
              </CardTitle>
              <CardDescription>
                Detailed explore analysis with specific cleanup recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {mockRunData.totalUnusedFields} unused fields to review
                </span>
                <Badge variant="outline">View Details</Badge>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  );
} 