import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetProductUnits, useAddProductUnit, useGetInventory } from '../../hooks/useQueries';
import { Plus, Package, Search } from 'lucide-react';
import { toast } from 'sonner';
import type { ProductUnit } from '../../backend';

export default function ProductsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    unitName: '',
    price: '',
    costPrice: '',
    minStock: '',
  });

  const { data: products = [], isLoading } = useGetProductUnits();
  const { data: inventory = [] } = useGetInventory();
  const addProduct = useAddProductUnit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.unitName || !formData.price || !formData.costPrice || !formData.minStock) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newProduct: ProductUnit = {
        id: BigInt(Date.now()),
        productId: BigInt(Date.now()),
        unitName: formData.unitName,
        price: BigInt(formData.price),
        costPrice: BigInt(formData.costPrice),
        stockQty: BigInt(0),
        minStock: BigInt(formData.minStock),
        expiryDate: undefined,
        createdAt: BigInt(Date.now() * 1000000),
      };

      await addProduct.mutateAsync(newProduct);
      toast.success('Product added successfully');
      setIsAddDialogOpen(false);
      setFormData({ unitName: '', price: '', costPrice: '', minStock: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.unitName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockQty = (unitId: bigint): bigint => {
    const invEntry = inventory.find((inv) => inv.unitId === unitId);
    return invEntry?.qty ?? BigInt(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="h-12">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Enter the product details below</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="unitName">Product Name *</Label>
                <Input
                  id="unitName"
                  value={formData.unitName}
                  onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                  placeholder="e.g., Basmati Rice 1kg"
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="100"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹) *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="80"
                    className="h-12"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level *</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                  placeholder="10"
                  className="h-12"
                />
              </div>
              <Button type="submit" size="lg" className="w-full h-12" disabled={addProduct.isPending}>
                {addProduct.isPending ? 'Adding...' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add your first product to get started'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockQty = getStockQty(product.id);
                    const isLowStock = stockQty > BigInt(0) && stockQty <= product.minStock;
                    const isOutOfStock = stockQty === BigInt(0);

                    return (
                      <TableRow key={product.id.toString()}>
                        <TableCell className="font-medium">{product.unitName}</TableCell>
                        <TableCell>₹{product.price.toString()}</TableCell>
                        <TableCell>₹{product.costPrice.toString()}</TableCell>
                        <TableCell>{stockQty.toString()}</TableCell>
                        <TableCell>{product.minStock.toString()}</TableCell>
                        <TableCell>
                          {isOutOfStock ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : isLowStock ? (
                            <Badge variant="outline" className="border-orange-500 text-orange-600">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-green-500 text-green-600">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
