'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createLookerConnection, FormState } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const initialState: FormState = {
  message: '',
  success: false,
};

function SubmitButton({ requiresOrganization }: { requiresOrganization?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Processing...' : requiresOrganization ? 'Create Organization & Add Connection' : 'Save Connection'}
    </Button>
  );
}

export default function ConnectionPage() {
  const [state, formAction] = useFormState(createLookerConnection, initialState);
  const [showOrgInput, setShowOrgInput] = useState(false);
  
  // Form state management
  const [formValues, setFormValues] = useState({
    lookerUrl: '',
    lookerPort: '',
    clientId: '',
    clientSecret: '',
    organizationName: ''
  });

  // Show organization input when required
  const requiresOrganization = state.requiresOrganization || showOrgInput;

  // Create a wrapper action that preserves form values 
  const handleFormAction = async (formData: FormData) => {
    // Store current values before submission
    setFormValues({
      lookerUrl: formData.get('lookerUrl') as string || '',
      lookerPort: formData.get('lookerPort') as string || '',
      clientId: formData.get('clientId') as string || '',
      clientSecret: formData.get('clientSecret') as string || '', // Keep client secret initially
      organizationName: formData.get('organizationName') as string || ''
    });
    
    // Call the actual server action
    return formAction(formData);
  };

  // Effect to handle clearing client secret only on errors
  useEffect(() => {
    // Only clear client secret if there was an error (not success states like requiresOrganization)
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

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Connect to Looker
          </CardTitle>
          <CardDescription>
            Configure your Looker instance connection. We&apos;ll automatically organize your team based on this connection.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.joinRequestSent ? (
            // Show join request confirmation
            <div className="text-center py-8 space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="text-lg font-semibold">Join Request Sent!</h3>
              <div className="space-y-2">
                                 <p className="text-slate-600">
                   Your request to join <strong>{state.existingOrganization?.name}</strong> has been sent.
                 </p>
                 <p className="text-sm text-slate-500">
                   You&apos;ll receive an email notification once an administrator approves your request.
                 </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Different Connection
              </Button>
            </div>
          ) : (
            <form action={handleFormAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="lookerUrl">Looker URL * (Organization Identifier)</Label>
                <Input 
                  type="url" 
                  id="lookerUrl" 
                  name="lookerUrl" 
                  required 
                  placeholder="https://yourcompany.looker.com"
                  className="w-full"
                  value={formValues.lookerUrl}
                  onChange={(e) => handleInputChange('lookerUrl', e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  This URL determines which organization you&apos;ll join or create
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lookerPort">Port (optional)</Label>
                <Input 
                  type="number" 
                  id="lookerPort" 
                  name="lookerPort" 
                  placeholder="443"
                  className="w-full"
                  value={formValues.lookerPort}
                  onChange={(e) => handleInputChange('lookerPort', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientId">Client ID *</Label>
                <Input 
                  type="text" 
                  id="clientId" 
                  name="clientId" 
                  required
                  placeholder="Your Looker API Client ID"
                  className="w-full"
                  value={formValues.clientId}
                  onChange={(e) => handleInputChange('clientId', e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Your personal API credentials for accessing this Looker instance
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientSecret">Client Secret *</Label>
                <Input 
                  type="password" 
                  id="clientSecret" 
                  name="clientSecret" 
                  required
                  placeholder="Your Looker API Client Secret"
                  className="w-full"
                  value={formValues.clientSecret}
                  onChange={(e) => handleInputChange('clientSecret', e.target.value)}
                />
                {state.message && !state.success && !state.requiresOrganization && !state.joinRequestSent && formValues.clientSecret === '' && (
                  <p className="text-xs text-amber-600">
                    Client secret was cleared for security. Please re-enter it.
                  </p>
                )}
              </div>

              {requiresOrganization && (
                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-slate-600" />
                    <Label htmlFor="organizationName" className="text-base font-medium">
                      Organization Name *
                    </Label>
                  </div>
                  <Input 
                    type="text" 
                    id="organizationName" 
                    name="organizationName" 
                    required={requiresOrganization}
                    placeholder="Your Company Name"
                    className="w-full"
                    value={formValues.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  />
                  <Alert>
                    <Building className="h-4 w-4" />
                    <AlertDescription>
                      This connection doesn&apos;t exist yet. We&apos;ll create a new organization for you and you&apos;ll become the administrator.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {!requiresOrganization && !state.requiresOrganization && (
                                 <Alert>
                   <Users className="h-4 w-4" />
                   <AlertDescription>
                     <strong>How it works:</strong> If this Looker URL already exists, you&apos;ll be prompted to join the existing team. 
                     If it&apos;s new, you&apos;ll create an organization for your team.
                   </AlertDescription>
                 </Alert>
              )}
              
              <SubmitButton requiresOrganization={requiresOrganization} />

              {state.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                  {state.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {state.message}
                  </AlertDescription>
                </Alert>
              )}

              {state.requiresOrganization && !showOrgInput && (
                <div className="pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowOrgInput(true)}
                    className="w-full"
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Create New Organization
                  </Button>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Connection-Driven Teams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <div>
              <p className="font-medium">New Connection</p>
              <p className="text-sm text-slate-600">Create an organization and become the administrator</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-green-600">2</span>
            </div>
            <div>
              <p className="font-medium">Existing Connection</p>
              <p className="text-sm text-slate-600">Send a request to join the existing team</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-purple-600">3</span>
            </div>
            <div>
              <p className="font-medium">Team Member</p>
              <p className="text-sm text-slate-600">Add connections to your existing organization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 