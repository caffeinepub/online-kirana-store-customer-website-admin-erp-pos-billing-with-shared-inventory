import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetProductUnits, useGetInventory } from '../../hooks/useQueries';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingCart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import ThemeToggle from '../../components/ThemeToggle';

interface BillItem {
  unitId: bigint;
  unitName: string;
  price: bigint;
  quantity: number;
}

export default function BillingModePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');

  const { data: products = [], refetch: refetchProducts } = useGetProductUnits();
  const { data: inventory = [], refetch: refetchInventory } = useGetInventory();

  const getStockQty = (unitId: bigint): bigint => {
    const invEntry = inventory.find((inv) => inv.unitId === unitId);
    return invEntry?.qty ?? BigInt(0);
  };

  const filteredProducts = products.filter((product) =>
    product.unitName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToBill = (product: typeof products[0]) => {
    const stockQty = getStockQty(product.id);
    if (stockQty === BigInt(0)) {
      toast.error('Product is out of stock');
      return;
    }

    const existingItem = billItems.find((item) => item.unitId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= Number(stockQty)) {
        toast.error('Cannot add more than available stock');
        return;
      }
      setBillItems(
        billItems.map((item) =>
          item.unitId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setBillItems([
        ...billItems,
        {
          unitId: product.id,
          unitName: product.unitName,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
    setSearchQuery('');
  };

  const updateQuantity = (unitId: bigint, delta: number) => {
    const stockQty = getStockQty(unitId);
    setBillItems(
      billItems
        .map((item) => {
          if (item.unitId === unitId) {
            const newQty = item.quantity + delta;
            if (newQty > Number(stockQty)) {
              toast.error('Cannot exceed available stock');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (unitId: bigint) => {
    setBillItems(billItems.filter((item) => item.unitId !== unitId));
  };

  const subtotal = billItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const discountAmount = Math.min(Number(discount) || 0, subtotal);
  const total = subtotal - discountAmount;

  const completeSale = async () => {
    if (billItems.length === 0) {
      toast.error('Add items to the bill first');
      return;
    }

    // Validate stock availability
    for (const item of billItems) {
      const stockQty = getStockQty(item.unitId);
      if (BigInt(item.quantity) > stockQty) {
        toast.error(`Insufficient stock for ${item.unitName}`);
        return;
      }
    }

    toast.success(`Sale completed! Total: ₹${total} (${paymentMethod.toUpperCase()})`);
    
    // Clear bill
    setBillItems([]);
    setDiscount('0');
    setPaymentMethod('cash');
    
    // Refresh inventory
    await refetchInventory();
    await refetchProducts();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin' })}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg leading-none">Billing Mode</h1>
              <p className="text-xs text-muted-foreground">POS System</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Product Search */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="search"
                  placeholder="Type product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 text-lg mb-4"
                  autoFocus
                />
                {searchQuery && (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No products found</p>
                    ) : (
                      filteredProducts.map((product) => {
                        const stockQty = getStockQty(product.id);
                        const isOutOfStock = stockQty === BigInt(0);

                        return (
                          <button
                            key={product.id.toString()}
                            onClick={() => addToBill(product)}
                            disabled={isOutOfStock}
                            className="w-full p-4 border rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{product.unitName}</p>
                                <p className="text-sm text-muted-foreground">
                                  Stock: {stockQty.toString()} units
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">₹{product.price.toString()}</p>
                                {isOutOfStock && (
                                  <Badge variant="destructive" className="mt-1">
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Bill */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Current Bill
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {billItems.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    Add items to start billing
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {billItems.map((item) => (
                        <div key={item.unitId.toString()} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.unitName}</p>
                            <p className="text-sm text-muted-foreground">₹{item.price.toString()} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => updateQuantity(item.unitId, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => updateQuantity(item.unitId, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-destructive"
                              onClick={() => removeItem(item.unitId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right font-bold">
                            ₹{(Number(item.price) * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-lg">
                        <span>Subtotal:</span>
                        <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Label htmlFor="discount" className="shrink-0">
                          Discount:
                        </Label>
                        <Input
                          id="discount"
                          type="number"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          placeholder="0"
                          className="h-12 text-lg"
                          min="0"
                          max={subtotal}
                        />
                      </div>

                      <div className="flex items-center justify-between text-2xl font-bold">
                        <span>Total:</span>
                        <span className="text-primary">₹{total.toLocaleString()}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label>Payment Method</Label>
                      <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'upi')}>
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              paymentMethod === 'cash' ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                            onClick={() => setPaymentMethod('cash')}
                          >
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Banknote className="h-5 w-5" />
                              Cash
                            </Label>
                          </div>
                          <div
                            className={`flex items-center space-x-2 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                            onClick={() => setPaymentMethod('upi')}
                          >
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                              <CreditCard className="h-5 w-5" />
                              UPI
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button size="lg" className="w-full h-14 text-lg" onClick={completeSale}>
                      Complete Sale - ₹{total.toLocaleString()}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
