import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useGetInventory, useGetProductUnits, useGetSuppliers, useAddInventoryEntry } from '../../hooks/useQueries';
import { Plus, Warehouse, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { InventoryEntry } from '../../backend';

export default function InventoryPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    unitId: '',
    qty: '',
    minStock: '',
    supplierId: '',
  });

  const { data: inventory = [], isLoading: inventoryLoading, refetch } = useGetInventory();
  const { data: products = [] } = useGetProductUnits();
  const { data: suppliers = [] } = useGetSuppliers();
  const addInventory = useAddInventoryEntry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.unitId || !formData.qty || !formData.minStock || !formData.supplierId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newEntry: InventoryEntry = {
        unitId: BigInt(formData.unitId),
        qty: BigInt(formData.qty),
        minStock: BigInt(formData.minStock),
        expiryDate: undefined,
        supplierId: BigInt(formData.supplierId),
      };

      await addInventory.mutateAsync(newEntry);
      toast.success('Inventory updated successfully');
      setIsAddDialogOpen(false);
      setFormData({ unitId: '', qty: '', minStock: '', supplierId: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update inventory');
    }
  };

  const getProductName = (unitId: bigint): string => {
    const product = products.find((p) => p.id === unitId);
    return product?.unitName || 'Unknown Product';
  };

  const getSupplierName = (supplierId: bigint): string => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const filteredInventory = inventory.filter((inv) => {
    const productName = getProductName(inv.unitId);
    return productName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory</h1>
          <p className="text-muted-foreground">Track and manage stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" onClick={() => refetch()} className="h-12">
            <RefreshCw className="mr-2 h-5 w-5" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-12">
                <Plus className="mr-2 h-5 w-5" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Inventory Entry</DialogTitle>
                <DialogDescription>Update stock for a product</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="unitId">Product *</Label>
                  <Select value={formData.unitId} onValueChange={(v) => setFormData({ ...formData, unitId: v })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id.toString()} value={product.id.toString()}>
                          {product.unitName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity *</Label>
                  <Input
                    id="qty"
                    type="number"
                    value={formData.qty}
                    onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
                    placeholder="100"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="10"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierId">Supplier *</Label>
                  <Select value={formData.supplierId} onValueChange={(v) => setFormData({ ...formData, supplierId: v })}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id.toString()} value={supplier.id.toString()}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" size="lg" className="w-full h-12" disabled={addInventory.isPending}>
                  {addInventory.isPending ? 'Adding...' : 'Add to Inventory'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {inventoryLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="text-center py-12">
              <Warehouse className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No inventory found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Add stock to get started'}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((inv, index) => {
                    const isLowStock = inv.qty > BigInt(0) && inv.qty <= inv.minStock;
                    const isOutOfStock = inv.qty === BigInt(0);

                    return (
                      <TableRow key={`${inv.unitId.toString()}-${index}`}>
                        <TableCell className="font-medium">{getProductName(inv.unitId)}</TableCell>
                        <TableCell>{inv.qty.toString()}</TableCell>
                        <TableCell>{inv.minStock.toString()}</TableCell>
                        <TableCell>{getSupplierName(inv.supplierId)}</TableCell>
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
