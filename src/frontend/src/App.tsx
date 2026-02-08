import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from './hooks/useQueries';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import CustomerLayout from './pages/customer/CustomerLayout';
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
import { UserRole } from './backend';
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
  const { data: role, isLoading } = useGetCallerUserRole();

  if (!identity) {
    return <AccessDeniedScreen />;
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

  if (role !== UserRole.admin) {
    return <AccessDeniedScreen />;
  }

  return <AdminLayout />;
}

// Customer route guard for cart/checkout/orders
function CustomerRouteGuard({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}

// Customer layout wrapper with admin auto-redirect
function CustomerLayoutWrapper() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  useEffect(() => {
    // Only redirect after everything is loaded and user has a profile
    if (!isInitializing && !roleLoading && !profileLoading && identity && userProfile && role === UserRole.admin) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on admin route
      if (!currentPath.startsWith('/admin')) {
        navigate({ to: '/admin', replace: true });
      }
    }
  }, [identity, role, userProfile, isInitializing, roleLoading, profileLoading, navigate]);

  return <CustomerLayout />;
}

// Create root route
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Login route (no auth required)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Customer routes with layout
const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'customer',
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

const cartRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/cart',
  component: () => (
    <CustomerRouteGuard>
      <CartPage />
    </CustomerRouteGuard>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/checkout',
  component: () => (
    <CustomerRouteGuard>
      <CheckoutPage />
    </CustomerRouteGuard>
  ),
});

const ordersRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/orders',
  component: () => (
    <CustomerRouteGuard>
      <OrdersPage />
    </CustomerRouteGuard>
  ),
});

const orderTrackingRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/orders/$orderId',
  component: () => (
    <CustomerRouteGuard>
      <OrderTrackingPage />
    </CustomerRouteGuard>
  ),
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: '/order-confirmation/$orderId',
  component: () => (
    <CustomerRouteGuard>
      <OrderConfirmationPage />
    </CustomerRouteGuard>
  ),
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

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/orders',
  component: OrderManagementPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  loginRoute,
  customerLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    contactRoute,
    goalsRoute,
    cartRoute,
    checkoutRoute,
    ordersRoute,
    orderTrackingRoute,
    orderConfirmationRoute,
  ]),
  adminRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminOrdersRoute,
  ]),
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
