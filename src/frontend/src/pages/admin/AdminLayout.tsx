import { Outlet, Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import ThemeToggle from '../../components/ThemeToggle';
import LoginButton from '../../components/auth/LoginButton';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  Truck,
  Menu,
  ShoppingBag,
  CreditCard,
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/admin/inventory', label: 'Inventory', icon: Warehouse },
  { to: '/admin/staff', label: 'Staff', icon: Users },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="space-y-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.to || (item.to !== '/admin' && currentPath.startsWith(item.to));
        
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-bold">Admin Panel</h2>
                  <p className="text-sm text-muted-foreground">Kirana Store Management</p>
                </div>
                <ScrollArea className="h-[calc(100vh-120px)] p-4">
                  <NavLinks onNavigate={() => setMobileMenuOpen(false)} />
                  <div className="mt-6 pt-6 border-t space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate({ to: '/billing' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Billing Mode
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate({ to: '/' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Customer Site
                    </Button>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg leading-none">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Kirana Store Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/billing' })}
              className="hidden md:flex"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="hidden md:flex"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Store
            </Button>
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r min-h-[calc(100vh-4rem)] sticky top-16">
          <ScrollArea className="h-full p-4">
            <NavLinks />
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
