import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, LogIn, AlertCircle } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-destructive/5 via-background to-destructive/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription>
            You need to be logged in to access this page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Available login options:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Internet Identity (blockchain-based authentication)</li>
                <li>Email + Password</li>
                <li>Email/Mobile + OTP</li>
              </ul>
              <p className="mt-2 text-sm">
                <strong>Note:</strong> Google, Facebook, and other social login options are not supported.
              </p>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Admin access is automatically granted to users who register with the bootstrap admin email address 
              configured in the system settings.
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => navigate({ to: '/login' })}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Go to Login Page
          </Button>

          <Button
            onClick={() => navigate({ to: '/' })}
            variant="outline"
            className="w-full"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
