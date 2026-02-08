import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, LogIn } from 'lucide-react';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-destructive/5 via-background to-destructive/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="mt-2">
              You need to be logged in to access this page.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Available login methods:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Internet Identity (recommended)</li>
              <li>Email + Password</li>
              <li>Email / Mobile + OTP</li>
            </ul>
            <p className="mt-3">
              <strong>Note:</strong> Google, Facebook, and other social login options are not supported.
            </p>
            <p className="mt-3 text-xs">
              For admin access, sign in with Internet Identity and ensure your profile email matches the configured bootstrap admin email.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/login' })}
            className="w-full"
            size="lg"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Go to Login Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
