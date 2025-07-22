"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  GitBranch, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Settings,
  ArrowLeft,
  Lightbulb
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock project data based on the CSV structure
const mockProjectData = [
  {
    name: "dna_legal",
    numModels: 1,
    numViewFiles: 38,
    gitConnectionStatus: "OK",
    prMode: "off",
    isValidationRequired: true
  },
  {
    name: "living_dna", 
    numModels: 1,
    numViewFiles: 35,
    gitConnectionStatus: "Bare repo, no tests required",
    prMode: "off",
    isValidationRequired: true
  },
  {
    name: "marketplace_extension_api_explorer",
    numModels: 1,
    numViewFiles: 0,
    gitConnectionStatus: "Bare repo, no tests required", 
    prMode: "off",
    isValidationRequired: false
  },
  {
    name: "marketplace_extension_data_dictionary",
    numModels: 1,
    numViewFiles: 0,
    gitConnectionStatus: "Bare repo, no tests required",
    prMode: "off", 
    isValidationRequired: false
  },
  {
    name: "marketplace_extension_lookml_diagram",
    numModels: 1,
    numViewFiles: 0,
    gitConnectionStatus: "Bare repo, no tests required",
    prMode: "off",
    isValidationRequired: false
  },
  {
    name: "marketplace_viz_liquid_fill_gauge",
    numModels: 0,
    numViewFiles: 0,
    gitConnectionStatus: "Bare repo, no tests required",
    prMode: "off",
    isValidationRequired: false
  },
  {
    name: "dna_legal_general",
    numModels: 1,
    numViewFiles: 43,
    gitConnectionStatus: "Bare repo, no tests required",
    prMode: "off",
    isValidationRequired: true
  }
];

function getGitStatusBadge(status: string) {
  if (status === "OK") {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        OK
      </Badge>
    );
  } else {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  }
}

function getValidationBadge(isRequired: boolean) {
  if (isRequired) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
        <Shield className="h-3 w-3 mr-1" />
        Enabled
      </Badge>
    );
  } else {
    return (
      <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
        <XCircle className="h-3 w-3 mr-1" />
        Disabled
      </Badge>
    );
  }
}

export default function ProjectInsightsPage() {
  const params = useParams();
  const runId = params.runId as string;

  const gitIssuesCount = mockProjectData.filter(p => p.gitConnectionStatus !== "OK").length;
  const validationDisabledCount = mockProjectData.filter(p => !p.isValidationRequired).length;
  const healthyProjectsCount = mockProjectData.filter(p => 
    p.gitConnectionStatus === "OK" && p.isValidationRequired
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Insights</h1>
          <p className="text-muted-foreground mt-1">
            Project-level configuration analysis for run {runId}
          </p>
        </div>
                    <Link href="/dashboard/henry-dashboard">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjectData.length}</div>
            <p className="text-xs text-muted-foreground">
              Active projects analyzed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyProjectsCount}</div>
            <p className="text-xs text-muted-foreground">
              Good Git & validation setup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Git Issues</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{gitIssuesCount}</div>
            <p className="text-xs text-muted-foreground">
              Projects with Git setup issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Disabled</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{validationDisabledCount}</div>
            <p className="text-xs text-muted-foreground">
              Projects without validation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Tips */}
      <div className="grid gap-4 md:grid-cols-2">
        <Alert>
          <GitBranch className="h-4 w-4" />
          <AlertTitle>Git Connection Issues</AlertTitle>
          <AlertDescription>
            {gitIssuesCount} projects have Git connection issues. Projects should have a proper Git connection
            to enable version control, collaboration, and deployment workflows.
          </AlertDescription>
        </Alert>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Enable Validation</AlertTitle>
          <AlertDescription>
            {validationDisabledCount} projects have validation disabled. Enable "Is Validation Required" 
            to enforce code quality and catch errors before deployment.
          </AlertDescription>
        </Alert>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Project Configuration Details</CardTitle>
          <CardDescription>
            Detailed view of all projects and their configuration status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Models</TableHead>
                <TableHead className="text-right">View Files</TableHead>
                <TableHead>Git Connection Status</TableHead>
                <TableHead>PR Mode</TableHead>
                <TableHead>Validation Required</TableHead>
                <TableHead>Health Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProjectData.map((project) => {
                const isHealthy = project.gitConnectionStatus === "OK" && project.isValidationRequired;
                const hasGitIssue = project.gitConnectionStatus !== "OK";
                const hasValidationIssue = !project.isValidationRequired;

                return (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell className="text-right">{project.numModels}</TableCell>
                    <TableCell className="text-right">{project.numViewFiles}</TableCell>
                    <TableCell>{getGitStatusBadge(project.gitConnectionStatus)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.prMode}</Badge>
                    </TableCell>
                    <TableCell>{getValidationBadge(project.isValidationRequired)}</TableCell>
                    <TableCell>
                      {isHealthy ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Healthy
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs Attention
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actionable Maintenance Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Actionable Maintenance Tips
          </CardTitle>
          <CardDescription>
            Specific recommendations to improve your project configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Fix Git Connection Issues
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Projects with Git issues should be connected to a proper Git repository for version control.
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockProjectData
                .filter(p => p.gitConnectionStatus !== "OK")
                .map(project => (
                  <li key={project.name} className="list-disc">
                    <strong>{project.name}:</strong> {project.gitConnectionStatus}
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Enable Validation
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Turn on "Is Validation Required" for all projects to enforce code quality and catch errors.
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockProjectData
                .filter(p => !p.isValidationRequired)
                .map(project => (
                  <li key={project.name} className="list-disc">
                    <strong>{project.name}:</strong> Validation currently disabled
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Consider Enabling PR Mode
            </h4>
            <p className="text-sm text-muted-foreground">
              All projects currently have PR mode disabled. Consider enabling PR mode for better collaboration 
              and code review workflows in production environments.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 