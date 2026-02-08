import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import CatalogPage from './pages/customer/CatalogPage';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import SuppliersPage from './pages/admin/SuppliersPage';
import InventoryPage from './pages/admin/InventoryPage';
import StaffPage from './pages/admin/StaffPage';
import BillingModePage from './pages/billing/BillingModePage';
import AccessDeniedScreen from './components/auth/AccessDeniedScreen';
import { Variant_customer_staff } from './backend';
import { useEffect } from 'react';

// Root layout component
function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <Toaster />
    </div>
  );
}

// Admin route guard component
function AdminRouteGuard() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return <AccessDeniedScreen message="Please login to access the admin area" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.userType !== Variant_customer_staff.staff) {
    return <AccessDeniedScreen message="Admin access is restricted to staff members only" />;
  }

  return <AdminLayout />;
}

// Billing route guard component
function BillingRouteGuard() {
  const { identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return <AccessDeniedScreen message="Please login to access billing mode" />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile || profile.userType !== Variant_customer_staff.staff) {
    return <AccessDeniedScreen message="Billing mode is restricted to staff members only" />;
  }

  return <BillingModePage />;
}

// Create root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Customer routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

// Admin routes with protection
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRouteGuard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: DashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: ProductsPage,
});

const adminSuppliersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/suppliers',
  component: SuppliersPage,
});

const adminInventoryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/inventory',
  component: InventoryPage,
});

const adminStaffRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/staff',
  component: StaffPage,
});

// Billing route with cashier protection
const billingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/billing',
  component: BillingRouteGuard,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  adminRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminSuppliersRoute,
    adminInventoryRoute,
    adminStaffRoute,
  ]),
  billingRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Type declaration for router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Clear cache on logout
  useEffect(() => {
    if (!identity) {
      // Cache is cleared in LoginButton component
    }
  }, [identity]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupDialog />}
    </ThemeProvider>
  );
}
