import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import KiranaBrandHeader from '../../components/KiranaBrandHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, AlertCircle, ShoppingCart, LayoutGrid } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';
import { useGetProductUnits, useGetInventory } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

const CATEGORIES = [
  { id: 'rice', name: 'Rice & Grains', icon: '🌾' },
  { id: 'atta', name: 'Atta & Flour', icon: '🌾' },
  { id: 'dal', name: 'Dal & Pulses', icon: '🫘' },
  { id: 'oil', name: 'Cooking Oil', icon: '🛢️' },
  { id: 'snacks', name: 'Snacks & Biscuits', icon: '🍪' },
  { id: 'soap', name: 'Soap & Hygiene', icon: '🧼' },
  { id: 'shampoo', name: 'Hair Care', icon: '🧴' },
  { id: 'packaged', name: 'Packaged Goods', icon: '📦' },
];

export default function CatalogPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products = [], isLoading: productsLoading } = useGetProductUnits();
  const { data: inventory = [], isLoading: inventoryLoading } = useGetInventory();

  const isLoading = productsLoading || inventoryLoading;

  // Get stock quantity for a product unit
  const getStockQty = (unitId: bigint): bigint => {
    const invEntry = inventory.find((inv) => inv.unitId === unitId);
    return invEntry?.qty ?? BigInt(0);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchQuery
      ? product.unitName.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    // Category filtering would require product category field (not in current backend)
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <KiranaBrandHeader />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Fresh Groceries
              <br />
              <span className="text-primary">Delivered Daily</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Quality dry groceries for your home. Rice, Atta, Dal, Oil, Snacks & more.
            </p>
            {!identity && (
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="h-12 px-8">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="border-b bg-card">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:border-primary hover:bg-primary/5 ${
                  selectedCategory === category.id ? 'border-primary bg-primary/10' : 'border-border'
                }`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-center">{category.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search & Products */}
      <div className="container px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Products will appear here once added by admin'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const stockQty = getStockQty(product.id);
              const isLowStock = stockQty > BigInt(0) && stockQty <= product.minStock;
              const isOutOfStock = stockQty === BigInt(0);

              return (
                <Card key={product.id.toString()} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg line-clamp-2">{product.unitName}</CardTitle>
                      {isOutOfStock && (
                        <Badge variant="destructive" className="shrink-0">
                          Out of Stock
                        </Badge>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <Badge variant="outline" className="shrink-0 border-orange-500 text-orange-600">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <CardDescription>Stock: {stockQty.toString()} units</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">₹{product.price.toString()}</span>
                        <span className="text-sm text-muted-foreground">per unit</span>
                      </div>
                      <Button
                        size="lg"
                        className="w-full h-12"
                        disabled={isOutOfStock || !identity}
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {!identity ? 'Login to Order' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Kirana Store</h3>
              <p className="text-sm text-muted-foreground">
                Your trusted neighborhood grocery store. Quality products at affordable prices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate({ to: '/admin' })} className="hover:text-foreground">
                    Admin Panel
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate({ to: '/billing' })} className="hover:text-foreground">
                    Billing Mode
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect With Us</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <SiFacebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <SiInstagram className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <SiX className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with ❤️ using{' '}
              <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline">
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
