import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, ShoppingCart, ShoppingBag, LogIn } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LoginButton from './auth/LoginButton';
import { useGetCart } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/goals', label: 'Goals' },
];

export default function KiranaBrandHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: cart = [] } = useGetCart();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const cartItemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/kirana-logo.dim_512x512.png"
              alt="Shree Kirana Logo"
              className="w-10 h-10 rounded-lg"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none">Shree Kirana</h1>
              <p className="text-xs text-muted-foreground">Your Neighborhood Store</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium hover:text-primary transition-colors"
              activeProps={{ className: 'text-primary' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Login Link for unauthenticated users */}
          {!identity && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/login' })}
              className="hidden sm:flex"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          )}

          {/* Cart Button */}
          {identity && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate({ to: '/cart' })}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          )}

          {/* Admin Link */}
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/admin' })}
              className="hidden lg:flex"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Admin
            </Button>
          )}

          <ThemeToggle />
          <LoginButton />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                      activeProps={{ className: 'bg-accent' }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="border-t pt-4 space-y-2">
                  {!identity && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate({ to: '/login' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </Button>
                  )}

                  {identity && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate({ to: '/cart' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Cart {cartItemCount > 0 && `(${cartItemCount})`}
                    </Button>
                  )}

                  {isAdmin && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate({ to: '/admin' });
                        setMobileMenuOpen(false);
                      }}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Admin Panel
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
