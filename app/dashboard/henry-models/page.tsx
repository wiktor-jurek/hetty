"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Search, 
  TrendingDown, 
  AlertTriangle, 
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Trash2,
  Archive,
  Lightbulb,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock model data based on the CSV structure
const mockModelData = [
  {
    project: "dna_legal",
    model: "dna_legal",
    numExplores: 10,
    numUnusedExplores: 6,
    queryCount: 1035,
    unusedExploresList: ["appointments", "invoice_items", "invoices", "shipping_costs", "user_targets", "user_targets_private"]
  },
  {
    project: "marketplace_extension_api_explorer",
    model: "extension-api-explorer", 
    numExplores: 0,
    numUnusedExplores: 0,
    queryCount: 0,
    unusedExploresList: []
  },
  {
    project: "marketplace_extension_data_dictionary",
    model: "data-dictionary",
    numExplores: 0,
    numUnusedExplores: 0,
    queryCount: 0,
    unusedExploresList: []
  },
  {
    project: "marketplace_extension_lookml_diagram", 
    model: "lookml-diagram",
    numExplores: 0,
    numUnusedExplores: 0,
    queryCount: 0,
    unusedExploresList: []
  },
  {
    project: "living_dna",
    model: "living_dna",
    numExplores: 24,
    numUnusedExplores: 24,
    queryCount: 0,
    unusedExploresList: [
      "api2sql_cj_commissions", "api_living_dna_activation_flow", "api_living_dna_kits", 
      "api_living_dna_orders", "api_living_dna_permissions", "api_living_dna_profiles",
      "api_living_dna_upload_referrals", "api_living_dna_users", "combined_orders",
      "ecommerce_currencies", "ecommerce_customer_addresses", "ecommerce_forex_rate_gbp",
      "ecommerce_order_line_items", "ecommerce_orders", "gdrive_country_codes",
      "gdrive_vat_rates", "kits", "orders", "partner_vitaminlabs_subscriptions",
      "precision_medicine_kits", "precision_medicine_orders", "precision_medicine_orders_items_report",
      "precision_medicine_orders_report", "precision_medicine_subscriptions"
    ]
  },
  {
    project: "dna_legal_general",
    model: "warehouse_general",
    numExplores: 8,
    numUnusedExplores: 7,
    queryCount: 21,
    unusedExploresList: ["appointments", "caserecords", "cases", "local_authority_spend", "local_authority_spend_private", "mim_samples", "uk_family_barristers"]
  }
];

function getHealthBadge(usedExplores: number, totalExplores: number) {
  if (totalExplores === 0) {
    return <Badge variant="secondary">No Explores</Badge>;
  }
  
  const usagePercentage = (usedExplores / totalExplores) * 100;
  
  if (usagePercentage >= 80) {
    return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>;
  } else if (usagePercentage >= 50) {
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Moderate</Badge>;
  } else {
    return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">High Bloat</Badge>;
  }
}

function ModelRow({ model }: { model: typeof mockModelData[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const usedExplores = model.numExplores - model.numUnusedExplores;
  const usagePercentage = model.numExplores > 0 ? (usedExplores / model.numExplores) * 100 : 0;

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            {model.numUnusedExplores > 0 ? (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            ) : (
              <div className="w-6" />
            )}
            <span className="font-medium">{model.model}</span>
          </div>
        </TableCell>
        <TableCell>{model.project}</TableCell>
        <TableCell className="text-right">{model.numExplores}</TableCell>
        <TableCell className="text-right">
          {model.numUnusedExplores > 0 ? (
            <span className="text-red-600 font-medium">{model.numUnusedExplores}</span>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </TableCell>
        <TableCell className="text-right">{model.queryCount.toLocaleString()}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Progress value={usagePercentage} className="w-20" />
            <span className="text-xs text-muted-foreground min-w-[3rem]">
              {usagePercentage.toFixed(0)}%
            </span>
          </div>
        </TableCell>
        <TableCell>{getHealthBadge(usedExplores, model.numExplores)}</TableCell>
      </TableRow>
      {model.numUnusedExplores > 0 && (
        <TableRow>
          <TableCell colSpan={7} className="p-0">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleContent>
                <div className="p-4 bg-muted/30 border-t">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    Unused Explores ({model.numUnusedExplores})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {model.unusedExploresList.map((explore, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {explore}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function ModelInsightsPage() {
  const params = useParams();
  const runId = params.runId as string;

  const totalModels = mockModelData.length;
  const totalUnusedExplores = mockModelData.reduce((sum, model) => sum + model.numUnusedExplores, 0);
  const modelsWithUnusedExplores = mockModelData.filter(model => model.numUnusedExplores > 0).length;
  const lowUsageModels = mockModelData.filter(model => 
    model.numUnusedExplores > 0 && model.queryCount < 100
  ).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Model Insights</h1>
          <p className="text-muted-foreground mt-1">
            Model health and composition analysis for run {runId}
          </p>
        </div>
        <Link href={`/henry/${runId}/dashboard`}>
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
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalModels}</div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models with Unused Explores</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{modelsWithUnusedExplores}</div>
            <p className="text-xs text-muted-foreground">
              Need cleanup attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unused Explores</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalUnusedExplores}</div>
            <p className="text-xs text-muted-foreground">
              Ready for removal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low-Usage Models</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{lowUsageModels}</div>
            <p className="text-xs text-muted-foreground">
              Consider archiving
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Alert>
          <Trash2 className="h-4 w-4" />
          <AlertTitle>Cleanup Opportunity</AlertTitle>
          <AlertDescription>
            {totalUnusedExplores} unused explores found across {modelsWithUnusedExplores} models. 
            These explores are not being queried and can be safely removed to reduce maintenance overhead.
          </AlertDescription>
        </Alert>

        <Alert>
          <Archive className="h-4 w-4" />
          <AlertTitle>Low-Usage Models</AlertTitle>
          <AlertDescription>
            {lowUsageModels} models have unused explores and very low query counts (&lt;100). 
            Consider archiving or deprecating these models if they're no longer needed.
          </AlertDescription>
        </Alert>
      </div>

      {/* Models Table */}
      <Card>
        <CardHeader>
          <CardTitle>Model Health Overview</CardTitle>
          <CardDescription>
            Detailed breakdown of model composition and usage patterns. Click the arrow to expand unused explores.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Total Explores</TableHead>
                <TableHead className="text-right">Unused Explores</TableHead>
                <TableHead className="text-right">Query Count</TableHead>
                <TableHead>Usage Rate</TableHead>
                <TableHead>Health Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockModelData.map((model, index) => (
                <ModelRow key={index} model={model} />
              ))}
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
            Specific recommendations to improve your model organization and reduce bloat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              High-Priority Cleanup
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Models with the most unused explores should be prioritized for cleanup:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockModelData
                .filter(model => model.numUnusedExplores > 0)
                .sort((a, b) => b.numUnusedExplores - a.numUnusedExplores)
                .slice(0, 3)
                .map(model => (
                  <li key={model.model} className="list-disc">
                    <strong>{model.model}:</strong> {model.numUnusedExplores} unused explores
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Consider Archiving
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Models with low usage and high bloat may be candidates for archiving:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockModelData
                .filter(model => model.queryCount < 100 && model.numUnusedExplores > 0)
                .map(model => (
                  <li key={model.model} className="list-disc">
                    <strong>{model.model}:</strong> {model.queryCount} queries, {model.numUnusedExplores} unused explores
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Cleanup Strategy
            </h4>
            <p className="text-sm text-muted-foreground">
              The unused explores list above serves as a direct to-do list for developers. 
              Start with models that have high query counts but many unused explores, 
              as these will provide the most immediate benefit from cleanup efforts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 