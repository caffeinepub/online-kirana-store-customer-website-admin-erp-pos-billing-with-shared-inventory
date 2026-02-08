import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetAllProducts, useAddToCart } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Hero3D from '../../components/hero/Hero3D';
import CategoriesMixedSection from '../../components/catalog/CategoriesMixedSection';

export default function CatalogPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: products = [], isLoading } = useGetAllProducts();
  const addToCart = useAddToCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleAddToCart = async (productId: bigint) => {
    if (!identity) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart.mutateAsync({ productId, quantity: 1n });
      toast.success('Added to cart!');
    } catch (error: any) {
      console.error('Add to cart error:', error);
      toast.error(error.message || 'Failed to add to cart');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Grocery-Themed Hero Section with 3D */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-900/20 border-b overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.05),transparent_50%)]" />
        <div className="container px-4 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 text-primary text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Fresh Arrivals Daily • Best Prices</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
                Welcome to <br />
                <span className="text-primary">
                  Shree Kirana
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-lg leading-relaxed">
                Your trusted neighborhood store for fresh groceries, daily essentials, and quality products at unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all" onClick={() => {
                  const productsSection = document.getElementById('categories');
                  productsSection?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 shadow-md hover:shadow-lg transition-all" onClick={() => navigate({ to: '/about' })}>
                  Learn More
                </Button>
              </div>
            </div>

            {/* Enhanced 3D Grocery Basket Scene */}
            <div className="relative h-[350px] md:h-[450px] lg:h-[550px]">
              <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent dark:from-orange-950/30 z-10 pointer-events-none" />
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200/20 to-amber-200/20 dark:from-orange-800/10 dark:to-amber-800/10 blur-3xl rounded-full" />
              <Hero3D />
            </div>
          </div>
        </div>
        
        {/* Decorative wave separator */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Categories Section with Mixed Layout */}
      <section id="categories" className="container px-4 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of fresh groceries and daily essentials
          </p>
        </div>
        
        <CategoriesMixedSection
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </section>

      {/* Products Section */}
      <section id="products" className="container px-4 py-12 pb-20">
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for products, brands, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg shadow-md"
            />
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg">Loading fresh products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground text-xl mb-2">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or category filter</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                {selectedCategory !== 'all' && (
                  <span> in <span className="font-semibold text-primary capitalize">{selectedCategory}</span></span>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id.toString()} className="flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                  <CardHeader className="p-0">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/assets/generated/kirana-logo.dim_512x512.png';
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-5">
                    <Badge variant="secondary" className="mb-3 capitalize text-xs font-semibold">
                      {product.category}
                    </Badge>
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">₹{Number(product.price)}</span>
                      {Number(product.stock) > 0 ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">In Stock</span>
                      ) : (
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-5 pt-0">
                    <Button
                      className="w-full shadow-md hover:shadow-lg transition-all"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addToCart.isPending || Number(product.stock) === 0}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {addToCart.isPending ? 'Adding...' : Number(product.stock) === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
