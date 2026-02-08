import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Fingerprint, Mail, Smartphone, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../../backend';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useGetCallerUserRole();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const isLoggingIn = loginStatus === 'logging-in';

  // Safe redirect logic using useEffect
  useEffect(() => {
    if (identity && !roleLoading && role !== undefined) {
      if (role === UserRole.admin) {
        navigate({ to: '/admin', replace: true });
      } else {
        navigate({ to: '/', replace: true });
      }
    }
  }, [identity, role, roleLoading, navigate]);

  const handleInternetIdentityLogin = async () => {
    try {
      login();
      // Role will be fetched automatically and redirect will happen via useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login');
    }
  };

  const handleEmailPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('Email+Password login requires backend implementation');
  };

  const handleOtpRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('OTP login requires backend implementation');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error('OTP verification requires backend implementation');
  };

  // Show loading state while checking authentication
  if (identity && roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to Shree Kirana</h1>
          <p className="text-muted-foreground">Sign in to access your account</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Google, Facebook, and other social login options are not supported. 
            Available options: Internet Identity, Email+Password, and Email/Mobile+OTP.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="internet-identity" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="internet-identity">
              <Fingerprint className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Internet ID</span>
            </TabsTrigger>
            <TabsTrigger value="email-password">
              <Mail className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="otp">
              <Smartphone className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">OTP</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internet-identity">
            <Card>
              <CardHeader>
                <CardTitle>Internet Identity</CardTitle>
                <CardDescription>
                  Secure, passwordless authentication using Internet Identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Internet Identity is a blockchain-based authentication system that doesn't require passwords. 
                    Your identity is cryptographically secured and works across all Internet Computer applications.
                  </p>
                </div>
                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                  size="lg"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="mr-2 h-5 w-5" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email-password">
            <Card>
              <CardHeader>
                <CardTitle>Email + Password</CardTitle>
                <CardDescription>
                  Sign in using your email address and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Email+Password authentication requires backend implementation and is not yet available.
                  </AlertDescription>
                </Alert>
                <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled
                        required
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="otp">
            <Card>
              <CardHeader>
                <CardTitle>Email / Mobile + OTP</CardTitle>
                <CardDescription>
                  Sign in using a one-time password sent to your email or mobile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    OTP authentication requires backend implementation and is not yet available.
                  </AlertDescription>
                </Alert>
                {!otpSent ? (
                  <form onSubmit={handleOtpRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Email or Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="text"
                        placeholder="email@example.com or +91 98765 43210"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        disabled
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled>
                      <Smartphone className="mr-2 h-5 w-5" />
                      Send OTP
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpVerify} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled
                        required
                        maxLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" size="lg" disabled>
                      Verify OTP
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setOtpSent(false)}
                      disabled
                    >
                      Resend OTP
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-muted-foreground">
          <p>Don't have an account? Sign up by logging in with Internet Identity.</p>
        </div>
      </div>
    </div>
  );
}
