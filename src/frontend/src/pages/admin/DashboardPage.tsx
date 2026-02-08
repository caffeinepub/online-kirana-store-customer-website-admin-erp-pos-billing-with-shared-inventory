import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, ShoppingCart, TrendingUp, AlertCircle, Mail } from 'lucide-react';
import { useGetAllProducts, useGetAllOrders, useGetBootstrapAdminEmail, useUpdateBootstrapAdminEmail } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: orders = [], isLoading: ordersLoading } = useGetAllOrders();
  const { data: bootstrapEmail = '', isLoading: emailLoading } = useGetBootstrapAdminEmail();
  const updateEmail = useUpdateBootstrapAdminEmail();

  const [newEmail, setNewEmail] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  const isLoading = productsLoading || ordersLoading;

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const completedOrders = orders.filter(o => o.status.toLowerCase() === 'completed').length;

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      description: 'Products in catalog',
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingCart,
      description: 'All time orders',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: AlertCircle,
      description: 'Awaiting processing',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: TrendingUp,
      description: 'Successfully delivered',
    },
  ];

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      await updateEmail.mutateAsync(newEmail.trim());
      toast.success('Bootstrap admin email updated successfully');
      setIsEditingEmail(false);
      setNewEmail('');
    } catch (error: any) {
      console.error('Update email error:', error);
      toast.error(error.message || 'Failed to update email');
    }
  };

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
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bootstrap Admin Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Admin Access Settings
          </CardTitle>
          <CardDescription>
            Configure the bootstrap admin email. Users who log in with Internet Identity and set this email in their profile will automatically receive admin access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emailLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : isEditingEmail ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Bootstrap Admin Email</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new admin email"
                  className="max-w-md"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateEmail} disabled={updateEmail.isPending}>
                  {updateEmail.isPending ? 'Updating...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsEditingEmail(false);
                  setNewEmail('');
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Current Bootstrap Admin Email:</p>
                <p className="text-lg font-mono">{bootstrapEmail}</p>
              </div>
              <Button variant="outline" onClick={() => {
                setNewEmail(bootstrapEmail);
                setIsEditingEmail(true);
              }}>
                Edit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id.toString()} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">Order #{order.id.toString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(Number(order.timestamp) / 1000000).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total.toString()} items</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
