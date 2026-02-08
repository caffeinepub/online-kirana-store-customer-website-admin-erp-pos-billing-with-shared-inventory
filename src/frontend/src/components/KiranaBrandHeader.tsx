import { Link } from '@tanstack/react-router';
import LoginButton from './auth/LoginButton';
import ThemeToggle from './ThemeToggle';
import { ShoppingBag } from 'lucide-react';

interface KiranaBrandHeaderProps {
  showLogin?: boolean;
}

export default function KiranaBrandHeader({ showLogin = true }: KiranaBrandHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Kirana Store</span>
            <span className="text-xs text-muted-foreground">Fresh & Quality</span>
          </div>
        </Link>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {showLogin && <LoginButton />}
        </div>
      </div>
    </header>
  );
}
