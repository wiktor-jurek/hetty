'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createLookerConnection, FormState } from '../../connections/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Shield, 
  Database, 
  Users, 
  Plus, 
  TestTube, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  Building
} from 'lucide-react';
import { useDashboard } from '../layout';

const initialState: FormState = {
  message: '',
  success: false,
};

interface JoinRequest {
  id: number;
  userId: string;
  organisationId: number;
  status: string;
  createdAt: string;
  userName: string;
  userEmail: string;
  organizationName: string;
}

function SubmitButton({ requiresOrganization }: { requiresOrganization?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Processing...' : requiresOrganization ? 'Create Organization & Add Connection' : 'Save Connection'}
    </Button>
  );
}

// Mock server actions (same as before)
async function testConnection(connectionId: number): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const success = Math.random() > 0.3;
  return {
    success,
    message: success 
      ? 'Connection test successful! Looker API is responding correctly.' 
      : 'Connection test failed. Please check your credentials and URL.'
  };
}

// Delete connection from organization
async function deleteConnectionFromOrg(connectionId: number, orgId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/connections/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        connectionId,
        organisationId: orgId,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Connection removed from organization successfully.'
      };
    } else {
      return {
        success: false,
        message: data.error || 'Failed to remove connection from organization.'
      };
    }
  } catch (error) {
    console.error('Error deleting connection:', error);
    return {
      success: false,
      message: 'Network error occurred while removing connection.'
    };
  }
}

export default function AdminPage() {
  const { 
    organizations, 
    selectedOrganization, 
    connections, 
    isLoading: dashboardLoading, 
    refreshData 
  } = useDashboard();

  const [state, formAction] = useFormState(createLookerConnection, initialState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testingConnection, setTestingConnection] = useState<number | null>(null);
  const [deletingConnection, setDeletingConnection] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<Record<number, { success: boolean; message: string }>>({});
  
  // Join requests state
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check if user is admin of any/selected organization
  const isAdmin = organizations.some(org => org.role === 'admin');
  const isAdminOfSelected = selectedOrganization && organizations.find(org => 
    org.organisationId === selectedOrganization.organisationId && org.role === 'admin'
  );
  
  // Get the primary admin organization for the page title
  const primaryAdminOrg = selectedOrganization && organizations.find(org => 
    org.organisationId === selectedOrganization.organisationId && org.role === 'admin'
  ) || organizations.find(org => org.role === 'admin');

  // Form state management
  const [formValues, setFormValues] = useState({
    lookerUrl: '',
    lookerPort: '',
    clientId: '',
    clientSecret: '',
    organizationName: ''
  });

  // Show organization input when required or when creating new org
  const requiresOrganization = state.requiresOrganization || !isAdmin;

  // Fetch join requests for admins
  const fetchJoinRequests = async () => {
    if (!isAdmin) return;
    
    setIsLoadingRequests(true);
    try {
      const response = await fetch('/api/admin/join-requests');
      if (response.ok) {
        const data = await response.json();
        setJoinRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (!dashboardLoading && isAdmin) {
      fetchJoinRequests();
    } else if (!dashboardLoading) {
      setIsLoadingRequests(false);
    }
  }, [dashboardLoading, isAdmin]);

  // Refresh data when form is successfully submitted
  useEffect(() => {
    if (state.success) {
      const handleSuccess = async () => {
        await refreshData();
        // Small delay to ensure data is refreshed before closing dialog
        setTimeout(() => {
          setIsModalOpen(false);
          setFormValues({
            lookerUrl: '',
            lookerPort: '',
            clientId: '',
            clientSecret: '',
            organizationName: ''
          });
        }, 100);
      };
      handleSuccess();
    }
  }, [state.success]);

  // Form handling functions
  const handleFormAction = async (formData: FormData) => {
    setFormValues({
      lookerUrl: formData.get('lookerUrl') as string || '',
      lookerPort: formData.get('lookerPort') as string || '',
      clientId: formData.get('clientId') as string || '',
      clientSecret: formData.get('clientSecret') as string || '',
      organizationName: formData.get('organizationName') as string || ''
    });
    return formAction(formData);
  };

  useEffect(() => {
    if (state.message && !state.success && !state.requiresOrganization && !state.joinRequestSent) {
      setFormValues(prev => ({
        ...prev,
        clientSecret: ''
      }));
    }
  }, [state]);

  const handleInputChange = (field: string, value: string) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async (connectionId: number) => {
    setTestingConnection(connectionId);
    try {
      const result = await testConnection(connectionId);
      setTestResults(prev => ({
        ...prev,
        [connectionId]: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [connectionId]: { success: false, message: 'Test failed due to network error.' }
      }));
    } finally {
      setTestingConnection(null);
    }
  };

  const handleDeleteConnection = async (connectionId: number) => {
    if (!selectedOrganization || !isAdminOfSelected) return;
    
    setDeletingConnection(connectionId);
    try {
      const result = await deleteConnectionFromOrg(connectionId, selectedOrganization.organisationId);
      if (result.success) {
        setAlert({ type: 'success', message: result.message });
        await refreshData();
      } else {
        // Show error message to user
        setAlert({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Failed to delete connection:', error);
      setAlert({ type: 'error', message: 'An unexpected error occurred while removing the connection.' });
    } finally {
      setDeletingConnection(null);
      // Clear alert after 5 seconds
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const handleApproveRequest = async (requestId: number, action: 'approve' | 'deny') => {
    setProcessingRequest(requestId);
    try {
      const response = await fetch('/api/join-requests/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          action,
        }),
      });

      if (response.ok) {
        setAlert({ 
          type: 'success', 
          message: action === 'approve' 
            ? 'Join request approved successfully!' 
            : 'Join request denied successfully!' 
        });
        await fetchJoinRequests();
      } else {
        const errorData = await response.json();
        setAlert({ 
          type: 'error', 
          message: errorData.error || 'Failed to process join request' 
        });
      }
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: 'An error occurred while processing the request' 
      });
    } finally {
      setProcessingRequest(null);
      setTimeout(() => setAlert(null), 5000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (dashboardLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Filter connections for selected organization
  const orgConnections = selectedOrganization 
    ? connections.filter(c => c.organisationId === selectedOrganization.organisationId)
    : connections;

  if (!isAdmin) {
    // Non-admin view: Create organization option
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Get Started</h2>
          <p className="text-muted-foreground">
            Create your organization and connect to your data sources.
          </p>
        </div>

        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-blue-800">Create Your Organization</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              Get started by creating your organization and adding your first connection.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                  <Plus className="h-4 w-4" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Your Organization</DialogTitle>
                  <DialogDescription>
                    Add your first connection to create your organization
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {state.message && (
                    <Alert className={`${state.success ? 'border-green-200 bg-green-50' : state.joinRequestSent ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                      {state.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : state.joinRequestSent ? (
                        <AlertCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={`${state.success ? 'text-green-800' : state.joinRequestSent ? 'text-blue-800' : 'text-red-800'}`}>
                        {state.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form action={handleFormAction} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="lookerUrl">Looker URL</Label>
                      <Input
                        id="lookerUrl"
                        name="lookerUrl"
                        type="url"
                        placeholder="https://your-company.looker.com"
                        value={formValues.lookerUrl}
                        onChange={(e) => handleInputChange('lookerUrl', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lookerPort">Looker Port (optional)</Label>
                      <Input
                        id="lookerPort"
                        name="lookerPort"
                        type="number"
                        placeholder="443"
                        value={formValues.lookerPort}
                        onChange={(e) => handleInputChange('lookerPort', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientId">Client ID</Label>
                      <Input
                        id="clientId"
                        name="clientId"
                        type="text"
                        placeholder="Your Looker API client ID"
                        value={formValues.clientId}
                        onChange={(e) => handleInputChange('clientId', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientSecret">Client Secret</Label>
                      <Input
                        id="clientSecret"
                        name="clientSecret"
                        type="password"
                        placeholder="Your Looker API client secret"
                        value={formValues.clientSecret}
                        onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizationName">Organization Name</Label>
                      <Input
                        id="organizationName"
                        name="organizationName"
                        type="text"
                        placeholder="Your organization name"
                        value={formValues.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        required
                      />
                    </div>

                    <SubmitButton requiresOrganization={requiresOrganization} />
                  </form>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin view: Connections and Join Requests
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {primaryAdminOrg ? `Manage ${primaryAdminOrg.organisationName}` : 'Admin'}
        </h2>
        <p className="text-muted-foreground">
          Manage organization connections, review join requests, and oversee member access.
        </p>
      </div>

      {alert && (
        <Alert className={alert.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {alert.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Join Requests
            {joinRequests.filter(req => req.status === 'pending').length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-red-100 text-red-800">
                {joinRequests.filter(req => req.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          {orgConnections.length > 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Organization Connections</CardTitle>
                    <CardDescription>
                      Connections available to {selectedOrganization?.organisationName || 'your organization'}
                    </CardDescription>
                  </div>
                  <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Connection
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Connection</DialogTitle>
                        <DialogDescription>
                          Add a connection to {selectedOrganization?.organisationName}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {state.message && (
                          <Alert className={`${state.success ? 'border-green-200 bg-green-50' : state.joinRequestSent ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                            {state.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : state.joinRequestSent ? (
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <AlertDescription className={`${state.success ? 'text-green-800' : state.joinRequestSent ? 'text-blue-800' : 'text-red-800'}`}>
                              {state.message}
                            </AlertDescription>
                          </Alert>
                        )}

                        <form action={handleFormAction} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="lookerUrl">Looker URL</Label>
                            <Input
                              id="lookerUrl"
                              name="lookerUrl"
                              type="url"
                              placeholder="https://your-company.looker.com"
                              value={formValues.lookerUrl}
                              onChange={(e) => handleInputChange('lookerUrl', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="lookerPort">Looker Port (optional)</Label>
                            <Input
                              id="lookerPort"
                              name="lookerPort"
                              type="number"
                              placeholder="443"
                              value={formValues.lookerPort}
                              onChange={(e) => handleInputChange('lookerPort', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="clientId">Client ID</Label>
                            <Input
                              id="clientId"
                              name="clientId"
                              type="text"
                              placeholder="Your Looker API client ID"
                              value={formValues.clientId}
                              onChange={(e) => handleInputChange('clientId', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="clientSecret">Client Secret</Label>
                            <Input
                              id="clientSecret"
                              name="clientSecret"
                              type="password"
                              placeholder="Your Looker API client secret"
                              value={formValues.clientSecret}
                              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                              required
                            />
                          </div>

                          <SubmitButton />
                        </form>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Connected</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orgConnections.map((connection) => (
                      <TableRow key={connection.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Database className="h-4 w-4 text-green-600" />
                            {connection.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-mono text-sm max-w-[200px] truncate">
                            {connection.uniqueIdentifier}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {connection.creatorName}
                            <div className="text-xs text-muted-foreground">
                              {connection.creatorEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(connection.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleTestConnection(connection.id)}
                              disabled={testingConnection === connection.id}
                              className="gap-1"
                            >
                              <TestTube className="h-3 w-3" />
                              {testingConnection === connection.id ? 'Testing...' : 'Test'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteConnection(connection.id)}
                              disabled={deletingConnection === connection.id}
                              className="gap-1 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              {deletingConnection === connection.id ? 'Removing...' : 'Remove'}
                            </Button>
                          </div>
                          {testResults[connection.id] && (
                            <div className={`mt-2 text-xs p-2 rounded ${
                              testResults[connection.id].success 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {testResults[connection.id].message}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-amber-800">No Connections Found</CardTitle>
                </div>
                <CardDescription className="text-amber-700">
                  {selectedOrganization 
                    ? `${selectedOrganization.organisationName} doesn't have any connections yet.`
                    : "This organization doesn't have any connections yet."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-amber-600 hover:bg-amber-700 gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Connection
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Connection</DialogTitle>
                      <DialogDescription>
                        Add the first connection to {selectedOrganization?.organisationName}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      {state.message && (
                        <Alert className={`${state.success ? 'border-green-200 bg-green-50' : state.joinRequestSent ? 'border-blue-200 bg-blue-50' : 'border-red-200 bg-red-50'}`}>
                          {state.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : state.joinRequestSent ? (
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription className={`${state.success ? 'text-green-800' : state.joinRequestSent ? 'text-blue-800' : 'text-red-800'}`}>
                            {state.message}
                          </AlertDescription>
                        </Alert>
                      )}

                      <form action={handleFormAction} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="lookerUrl">Looker URL</Label>
                          <Input
                            id="lookerUrl"
                            name="lookerUrl"
                            type="url"
                            placeholder="https://your-company.looker.com"
                            value={formValues.lookerUrl}
                            onChange={(e) => handleInputChange('lookerUrl', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lookerPort">Looker Port (optional)</Label>
                          <Input
                            id="lookerPort"
                            name="lookerPort"
                            type="number"
                            placeholder="443"
                            value={formValues.lookerPort}
                            onChange={(e) => handleInputChange('lookerPort', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientId">Client ID</Label>
                          <Input
                            id="clientId"
                            name="clientId"
                            type="text"
                            placeholder="Your Looker API client ID"
                            value={formValues.clientId}
                            onChange={(e) => handleInputChange('clientId', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="clientSecret">Client Secret</Label>
                          <Input
                            id="clientSecret"
                            name="clientSecret"
                            type="password"
                            placeholder="Your Looker API client secret"
                            value={formValues.clientSecret}
                            onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                            required
                          />
                        </div>

                        <SubmitButton />
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {joinRequests.length === 0 ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <CardTitle>No Join Requests</CardTitle>
                </div>
                <CardDescription>
                  There are no pending join requests for your organizations at this time.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join Requests ({joinRequests.filter(req => req.status === 'pending').length} pending)
                </CardTitle>
                <CardDescription>
                  Requests from users to join your organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {joinRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{request.userName}</div>
                              <div className="text-xs text-muted-foreground">{request.userEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{request.organizationName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDate(request.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              request.status === 'pending' 
                                ? 'secondary' 
                                : request.status === 'approved' 
                                  ? 'default' 
                                  : 'destructive'
                            }
                            className={
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : request.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }
                          >
                            {request.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {request.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {request.status === 'denied' && <XCircle className="h-3 w-3 mr-1" />}
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveRequest(request.id, 'approve')}
                                disabled={processingRequest === request.id}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {processingRequest === request.id ? 'Processing...' : 'Approve'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveRequest(request.id, 'deny')}
                                disabled={processingRequest === request.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                {processingRequest === request.id ? 'Processing...' : 'Deny'}
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 