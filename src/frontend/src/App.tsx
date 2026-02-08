import { StrictMode, useEffect, useState } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStatus } from './hooks/useAuthStatus';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';

import CatalogPage from './pages/customer/CatalogPage';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage';
import OrdersPage from './pages/customer/OrdersPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import AboutPage from './pages/customer/AboutPage';
import ContactPage from './pages/customer/ContactPage';
import GoalsPage from './pages/customer/GoalsPage';
import LoginPage from './pages/auth/LoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import CustomerLayout from './pages/customer/CustomerLayout';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function CustomerLayoutWrapper() {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  // Auto-redirect authenticated admins to /admin
  useEffect(() => {
    if (isAuthenticated && !isLoading && isAdmin) {
      navigate({ to: '/admin', replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  return <CustomerLayout />;
}

function AdminRouteGuard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <AdminLayout />;
}

function CustomerRouteGuard() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  return <Outlet />;
}

function ProfileSetupWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !authLoading && !profileLoading && isFetched && userProfile === null) {
      setIsDialogOpen(true);
    }
  }, [isAuthenticated, authLoading, profileLoading, isFetched, userProfile]);

  const handleProfileSave = async (profile: { name: string; email: string; address: string }) => {
    try {
      await saveProfile.mutateAsync(profile);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    }
  };

  return (
    <>
      {children}
      <ProfileSetupDialog
        open={isDialogOpen}
        onSave={handleProfileSave}
        isSaving={saveProfile.isPending}
      />
    </>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <ProfileSetupWrapper>
      <Outlet />
    </ProfileSetupWrapper>
  ),
});

const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'customer-layout',
  component: CustomerLayoutWrapper,
});

const indexRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/',
  component: CatalogPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/about',
  component: AboutPage,
});

const contactRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/contact',
  component: ContactPage,
});

const goalsRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/goals',
  component: GoalsPage,
});

const customerGuardRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  id: 'customer-guard',
  component: CustomerRouteGuard,
});

const cartRoute = createRoute({
  getParentRoute: () => customerGuardRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => customerGuardRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => customerGuardRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const ordersRoute = createRoute({
  getParentRoute: () => customerGuardRoute,
  path: '/orders',
  component: OrdersPage,
});

const orderTrackingRoute = createRoute({
  getParentRoute: () => customerGuardRoute,
  path: '/orders/$orderId',
  component: OrderTrackingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: AdminRouteGuard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: DashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/products',
  component: ProductsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/orders',
  component: OrderManagementPage,
});

const routeTree = rootRoute.addChildren([
  customerLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    contactRoute,
    goalsRoute,
    customerGuardRoute.addChildren([
      cartRoute,
      checkoutRoute,
      orderConfirmationRoute,
      ordersRoute,
      orderTrackingRoute,
    ]),
  ]),
  loginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <InternetIdentityProvider>
            <RouterProvider router={router} />
            <Toaster />
          </InternetIdentityProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
