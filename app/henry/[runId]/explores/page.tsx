"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff,
  FileText,
  Trash2,
  Lightbulb,
  AlertTriangle,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock explore data based on the CSV structure
const mockExploreData = [
  {
    model: "dna_legal",
    explore: "shipping_costs",
    isHidden: false,
    hasDescription: false,
    numJoins: 0,
    numUnusedJoins: 0,
    numFields: 27,
    numUnusedFields: 10,
    queryCount: 0,
    unusedJoins: [],
    unusedFields: [
      "shipping_costs.average_dhl_cost", "shipping_costs.average_invoice_cost", 
      "shipping_costs.chemtox_adex_cost_gbp", "shipping_costs.cost_date",
      "shipping_costs.cost_month", "shipping_costs.cost_quarter",
      "shipping_costs.cost_week", "shipping_costs.cost_year",
      "shipping_costs.count", "shipping_costs.dhl_cost_gbp"
    ]
  },
  {
    model: "dna_legal",
    explore: "invoice_items",
    isHidden: false,
    hasDescription: false,
    numJoins: 2,
    numUnusedJoins: 0,
    numFields: 144,
    numUnusedFields: 7,
    queryCount: 0,
    unusedJoins: [],
    unusedFields: [
      "accounts.account_commission_joining_information", "accounts.account_manager_id",
      "accounts.account_name", "accounts.account_status", "accounts.account_type",
      "invoice_items.cost_price", "invoice_items.profit_margin"
    ]
  },
  {
    model: "dna_legal",
    explore: "invoices",
    isHidden: false,
    hasDescription: false,
    numJoins: 13,
    numUnusedJoins: 2,
    numFields: 323,
    numUnusedFields: 17,
    queryCount: 0,
    unusedJoins: ["cases", "invoice_items"],
    unusedFields: [
      "accounts.account_commission_joining_information", "accounts.account_manager_id",
      "accounts.account_name", "accounts.account_status", "cases.account_id",
      "cases.case_number", "cases.case_worker_id", "cases.client_ref",
      "invoice_items.average_profit", "invoice_items.cost_price", "invoice_items.description",
      "invoices.additional_notes", "invoices.case_id", "invoices.client_reference",
      "invoices.contact_id", "invoices.payment_date", "invoices.purchase_order"
    ]
  },
  {
    model: "dna_legal",
    explore: "quote_drop_off",
    isHidden: false,
    hasDescription: false,
    numJoins: 7,
    numUnusedJoins: 4,
    numFields: 1087,
    numUnusedFields: 24,
    queryCount: 56,
    unusedJoins: ["dnacr_caserecords_sugar_crm", "quotes_accounts_sugar_crm", "quotes_dnacr_caserecords_1_c_sugar_crm", "quotes_original_converted_subtotal"],
    unusedFields: [
      "accounts_sugar_crm.account_category", "accounts_sugar_crm.account_number_c",
      "accounts_sugar_crm.account_rank", "accounts_sugar_crm.annual_revenue",
      "dnacr_caserecords_sugar_crm.access_code_1_c", "dnacr_caserecords_sugar_crm.barcode",
      "quotes_sugar_crm.abuse_history_c", "quotes_sugar_crm.billing_address_city"
    ]
  },
  {
    model: "dna_legal",
    explore: "account_converted_drop_off",
    isHidden: false,
    hasDescription: false,
    numJoins: 9,
    numUnusedJoins: 1,
    numFields: 767,
    numUnusedFields: 19,
    queryCount: 390,
    unusedJoins: ["user_targets_daily"],
    unusedFields: [
      "account_users.acl_role_set_id", "account_users.address_city",
      "quotes_sugar_crm.abuse_history_c", "quotes_sugar_crm.billing_address_city",
      "user_targets_daily.average_distinct_daily_target", "user_targets_daily.daily_target"
    ]
  },
  {
    model: "dna_legal",
    explore: "user_targets",
    isHidden: false,
    hasDescription: false,
    numJoins: 5,
    numUnusedJoins: 2,
    numFields: 483,
    numUnusedFields: 13,
    queryCount: 0,
    unusedJoins: ["accounts", "users"],
    unusedFields: [
      "accounts.account_number_c", "accounts.account_rank", "accounts.annual_revenue",
      "users.created_date", "users.email", "users.first_name"
    ]
  }
];

function getUsageBadge(queryCount: number) {
  if (queryCount === 0) {
    return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">Unused</Badge>;
  } else if (queryCount < 50) {
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Low</Badge>;
  } else if (queryCount < 200) {
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Moderate</Badge>;
  } else {
    return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">High</Badge>;
  }
}

function getBloatBadge(unusedFields: number, totalFields: number) {
  const bloatPercentage = (unusedFields / totalFields) * 100;
  
  if (bloatPercentage >= 10) {
    return <Badge variant="destructive">High Bloat ({bloatPercentage.toFixed(1)}%)</Badge>;
  } else if (bloatPercentage >= 5) {
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
      Moderate ({bloatPercentage.toFixed(1)}%)
    </Badge>;
  } else if (bloatPercentage > 0) {
    return <Badge variant="outline">Low ({bloatPercentage.toFixed(1)}%)</Badge>;
  } else {
    return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Clean</Badge>;
  }
}

function ExploreRow({ explore }: { explore: typeof mockExploreData[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasCleanupItems = explore.numUnusedFields > 0 || explore.numUnusedJoins > 0;

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-2">
            {hasCleanupItems ? (
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
            <span className="font-medium">{explore.explore}</span>
          </div>
        </TableCell>
        <TableCell>{explore.model}</TableCell>
        <TableCell>
          {explore.isHidden ? (
            <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
              <EyeOff className="h-3 w-3 mr-1" />
              Hidden
            </Badge>
          ) : (
            <Badge variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Visible
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {explore.hasDescription ? (
            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
              <FileText className="h-3 w-3 mr-1" />
              Yes
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
              <FileText className="h-3 w-3 mr-1" />
              Missing
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-right">{explore.numJoins}</TableCell>
        <TableCell className="text-right">
          {explore.numUnusedJoins > 0 ? (
            <span className="text-red-600 font-medium">{explore.numUnusedJoins}</span>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </TableCell>
        <TableCell className="text-right">{explore.numFields}</TableCell>
        <TableCell className="text-right">
          {explore.numUnusedFields > 0 ? (
            <span className="text-red-600 font-medium">{explore.numUnusedFields}</span>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </TableCell>
        <TableCell className="text-right">{explore.queryCount.toLocaleString()}</TableCell>
        <TableCell>{getUsageBadge(explore.queryCount)}</TableCell>
        <TableCell>{getBloatBadge(explore.numUnusedFields, explore.numFields)}</TableCell>
      </TableRow>
      {hasCleanupItems && (
        <TableRow>
          <TableCell colSpan={11} className="p-0">
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleContent>
                <div className="p-4 bg-muted/30 border-t space-y-4">
                  {explore.numUnusedJoins > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Unused Joins ({explore.numUnusedJoins})
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {explore.unusedJoins.map((join, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {join}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {explore.numUnusedFields > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-500" />
                        Unused Fields ({explore.numUnusedFields})
                      </h4>
                      <div className="grid grid-cols-3 gap-1">
                        {explore.unusedFields.slice(0, 10).map((field, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                        {explore.unusedFields.length > 10 && (
                          <Badge variant="secondary" className="text-xs">
                            +{explore.unusedFields.length - 10} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function ExploreInsightsPage() {
  const params = useParams();
  const runId = params.runId as string;
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModel, setFilterModel] = useState("all");
  const [filterUsage, setFilterUsage] = useState("all");

  // Filter explores based on search and filters
  const filteredExplores = mockExploreData.filter(explore => {
    const matchesSearch = explore.explore.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         explore.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModel = filterModel === "all" || explore.model === filterModel;
    
    const matchesUsage = filterUsage === "all" || 
                        (filterUsage === "unused" && explore.queryCount === 0) ||
                        (filterUsage === "low" && explore.queryCount > 0 && explore.queryCount < 50) ||
                        (filterUsage === "high" && explore.queryCount >= 50);
    
    return matchesSearch && matchesModel && matchesUsage;
  });

  const uniqueModels = [...new Set(mockExploreData.map(e => e.model))];
  
  const totalExplores = mockExploreData.length;
  const exploredWithoutDesc = mockExploreData.filter(e => !e.hasDescription).length;
  const hiddenExploresWithQueries = mockExploreData.filter(e => e.isHidden && e.queryCount > 0).length;
  const lowUsageExplores = mockExploreData.filter(e => e.queryCount > 0 && e.queryCount < 10).length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Explore Insights</h1>
          <p className="text-muted-foreground mt-1">
            Detailed explore analysis and cleanup recommendations for run {runId}
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
            <CardTitle className="text-sm font-medium">Total Explores</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExplores}</div>
            <p className="text-xs text-muted-foreground">
              Across all models
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Descriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{exploredWithoutDesc}</div>
            <p className="text-xs text-muted-foreground">
              Need documentation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hidden but Active</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{hiddenExploresWithQueries}</div>
            <p className="text-xs text-muted-foreground">
              Review visibility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Usage</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowUsageExplores}</div>
            <p className="text-xs text-muted-foreground">
              Consider deprecation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Alerts */}
      <div className="grid gap-4 md:grid-cols-3">
        <Alert>
          <FileText className="h-4 w-4" />
          <AlertTitle>Add Descriptions</AlertTitle>
          <AlertDescription>
            {exploredWithoutDesc} explores are missing descriptions. Good documentation improves discoverability and usage.
          </AlertDescription>
        </Alert>

        <Alert>
          <EyeOff className="h-4 w-4" />
          <AlertTitle>Review Hidden Explores</AlertTitle>
          <AlertDescription>
            {hiddenExploresWithQueries} hidden explores still receive queries. Consider making them visible or reviewing their usage.
          </AlertDescription>
        </Alert>

        <Alert>
          <TrendingDown className="h-4 w-4" />
          <AlertTitle>Deprecate Low-Usage</AlertTitle>
          <AlertDescription>
            {lowUsageExplores} explores have very low query counts. Consider deprecating if they're no longer needed.
          </AlertDescription>
        </Alert>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Analysis</CardTitle>
          <CardDescription>
            Filter and search through all explores. Click the arrow to see detailed cleanup information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search explores or models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterModel} onValueChange={setFilterModel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                {uniqueModels.map(model => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterUsage} onValueChange={setFilterUsage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Usage Levels</SelectItem>
                <SelectItem value="unused">Unused (0 queries)</SelectItem>
                <SelectItem value="low">Low (&lt;50 queries)</SelectItem>
                <SelectItem value="high">High (50+ queries)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Explore Name</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Joins</TableHead>
                <TableHead className="text-right">Unused Joins</TableHead>
                <TableHead className="text-right">Fields</TableHead>
                <TableHead className="text-right">Unused Fields</TableHead>
                <TableHead className="text-right">Query Count</TableHead>
                <TableHead>Usage Level</TableHead>
                <TableHead>Bloat Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExplores.map((explore, index) => (
                <ExploreRow key={index} explore={explore} />
              ))}
            </TableBody>
          </Table>
          
          {filteredExplores.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No explores match your current filters.
            </div>
          )}
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
            Specific recommendations to improve your explore organization and reduce maintenance overhead
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Add Missing Descriptions
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              The following explores lack descriptions and should be documented:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockExploreData
                .filter(e => !e.hasDescription)
                .slice(0, 5)
                .map(explore => (
                  <li key={explore.explore} className="list-disc">
                    <strong>{explore.model}.{explore.explore}</strong>
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              Review Hidden Explores with High Usage
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              These hidden explores still receive significant queries:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockExploreData
                .filter(e => e.isHidden && e.queryCount > 0)
                .map(explore => (
                  <li key={explore.explore} className="list-disc">
                    <strong>{explore.model}.{explore.explore}:</strong> {explore.queryCount} queries
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              High-Impact Cleanup Targets
            </h4>
            <p className="text-sm text-muted-foreground mb-2">
              Focus cleanup efforts on explores with the most unused content:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              {mockExploreData
                .filter(e => e.numUnusedFields > 0)
                .sort((a, b) => b.numUnusedFields - a.numUnusedFields)
                .slice(0, 3)
                .map(explore => (
                  <li key={explore.explore} className="list-disc">
                    <strong>{explore.model}.{explore.explore}:</strong> {explore.numUnusedFields} unused fields, {explore.numUnusedJoins} unused joins
                  </li>
                ))}
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Deprecation Candidates
            </h4>
            <p className="text-sm text-muted-foreground">
              Explores with very low query counts may be candidates for deprecation. 
              The detailed lists of unused joins and fields above provide direct, actionable items for developers to address.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 