import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useGetCart, useGetAllProducts, useRemoveFromCart, useClearCart } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart = [], isLoading: cartLoading } = useGetCart();
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const isLoading = cartLoading || productsLoading;

  const handleRemoveItem = async (productId: bigint) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Remove from cart error:', error);
      toast.error(error.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Clear cart error:', error);
      toast.error(error.message || 'Failed to clear cart');
    }
  };

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const total = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  if (isLoading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to get started</p>
            <Button onClick={() => navigate({ to: '/' })}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={handleClearCart} disabled={clearCart.isPending}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.productId.toString()}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.product?.name || 'Unknown Product'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.product?.description || ''}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <span className="font-medium">{item.quantity.toString()}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={removeFromCart.isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items</span>
                  <span className="font-medium">{total}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-6">
                    <span>Total</span>
                    <span>{total} items</span>
                  </div>
                  <Button
                    className="w-full h-12"
                    size="lg"
                    onClick={() => navigate({ to: '/checkout' })}
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate({ to: '/' })}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
