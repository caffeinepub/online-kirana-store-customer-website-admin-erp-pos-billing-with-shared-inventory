import { Outlet } from '@tanstack/react-router';
import KiranaBrandHeader from '../../components/KiranaBrandHeader';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <KiranaBrandHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/generated/kirana-logo.dim_512x512.png" 
                  alt="Shree Kirana" 
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-lg">Shree Kirana</h3>
                  <p className="text-xs text-muted-foreground">Fresh & Quality</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted neighborhood store for quality groceries and daily essentials.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Shop</a></li>
                <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="/goals" className="text-muted-foreground hover:text-foreground transition-colors">Our Mission</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <SiFacebook className="w-5 h-5 text-primary" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <SiX className="w-5 h-5 text-primary" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <SiInstagram className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1 flex-wrap">
              © 2026. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
