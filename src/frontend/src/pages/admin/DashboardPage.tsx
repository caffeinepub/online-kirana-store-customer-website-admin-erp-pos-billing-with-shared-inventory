import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetProductUnits, useGetInventory } from '../../hooks/useQueries';
import { Package, AlertTriangle, TrendingUp, Warehouse } from 'lucide-react';

export default function DashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useGetProductUnits();
  const { data: inventory = [], isLoading: inventoryLoading } = useGetInventory();

  const isLoading = productsLoading || inventoryLoading;

  // Calculate metrics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, product) => {
    const invEntry = inventory.find((inv) => inv.unitId === product.id);
    const qty = invEntry?.qty ?? BigInt(0);
    return sum + Number(qty) * Number(product.price);
  }, 0);

  const lowStockItems = products.filter((product) => {
    const invEntry = inventory.find((inv) => inv.unitId === product.id);
    const qty = invEntry?.qty ?? BigInt(0);
    return qty > BigInt(0) && qty <= product.minStock;
  });

  const outOfStockItems = products.filter((product) => {
    const invEntry = inventory.find((inv) => inv.unitId === product.id);
    const qty = invEntry?.qty ?? BigInt(0);
    return qty === BigInt(0);
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Active product units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalInventoryValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Total stock value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Items need reorder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <Warehouse className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{outOfStockItems.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Items unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Stock Alerts</h2>

          {outOfStockItems.length > 0 && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Out of Stock Items
                </CardTitle>
                <CardDescription>These items are currently unavailable</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {outOfStockItems.slice(0, 5).map((product) => (
                    <div key={product.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{product.unitName}</span>
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  ))}
                  {outOfStockItems.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{outOfStockItems.length - 5} more items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {lowStockItems.length > 0 && (
            <Card className="border-orange-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Low Stock Items
                </CardTitle>
                <CardDescription>These items are running low</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockItems.slice(0, 5).map((product) => {
                    const invEntry = inventory.find((inv) => inv.unitId === product.id);
                    const qty = invEntry?.qty ?? BigInt(0);
                    return (
                      <div key={product.id.toString()} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">{product.unitName}</span>
                          <p className="text-sm text-muted-foreground">
                            Stock: {qty.toString()} / Min: {product.minStock.toString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="border-orange-500 text-orange-600">
                          Low Stock
                        </Badge>
                      </div>
                    );
                  })}
                  {lowStockItems.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      +{lowStockItems.length - 5} more items
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
