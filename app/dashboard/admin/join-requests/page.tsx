'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, CheckCircle, XCircle, Clock, AlertCircle, User, Calendar } from 'lucide-react';
import { useDashboard } from '../../layout';

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

export default function AdminJoinRequestsPage() {
  const { organizations, selectedOrganization, isLoading: dashboardLoading } = useDashboard();
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check if user is admin of any organization
  const isAdmin = organizations.some(org => org.role === 'admin');
  
  // Get the primary admin organization for the page title
  const primaryAdminOrg = selectedOrganization && organizations.find(org => 
    org.organisationId === selectedOrganization.organisationId && org.role === 'admin'
  ) || organizations.find(org => org.role === 'admin');

  const fetchJoinRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/join-requests');
      if (response.ok) {
        const data = await response.json();
        setJoinRequests(data.requests || []);
      } else {
        console.error('Failed to fetch join requests');
      }
    } catch (error) {
      console.error('Error fetching join requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!dashboardLoading && isAdmin) {
      fetchJoinRequests();
    } else if (!dashboardLoading) {
      setIsLoading(false);
    }
  }, [dashboardLoading, isAdmin]);

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
        const data = await response.json();
        setAlert({ 
          type: 'success', 
          message: action === 'approve' 
            ? 'Join request approved successfully!' 
            : 'Join request denied successfully!' 
        });
        // Refresh the requests list
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
      // Clear alert after 5 seconds
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

  if (dashboardLoading || isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {primaryAdminOrg ? `Manage ${primaryAdminOrg.organisationName}` : 'Manage Organisation'}
          </h2>
          <p className="text-muted-foreground">Loading organisation details...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            {primaryAdminOrg ? `Manage ${primaryAdminOrg.organisationName}` : 'Manage Organisation'}
          </h2>
          <p className="text-muted-foreground">
            Manage your organization settings, members, and join requests.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-amber-800">Access Denied</CardTitle>
            </div>
            <CardDescription className="text-amber-700">
              You need to be an administrator of at least one organization to manage organisation settings.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {primaryAdminOrg ? `Manage ${primaryAdminOrg.organisationName}` : 'Manage Organisation'}
        </h2>
        <p className="text-muted-foreground">
          Manage organization settings, review join requests, and oversee member access.
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
    </div>
  );
} 