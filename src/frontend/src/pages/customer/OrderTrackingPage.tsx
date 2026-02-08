import { useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Clock, CheckCircle, XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useGetOrder } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function OrderTrackingPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false });
  const getOrder = useGetOrder();

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    if (!orderId) return;
    try {
      await getOrder.mutateAsync(BigInt(orderId));
    } catch (error: any) {
      console.error('Load order error:', error);
      toast.error(error.message || 'Failed to load order');
    }
  };

  const order = getOrder.data;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-600" />;
      case 'processing':
        return <Package className="h-8 w-8 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-600" />;
      default:
        return <Package className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'processing':
        return 'default';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (getOrder.isPending) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist</p>
            <Button onClick={() => navigate({ to: '/orders' })}>
              View All Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate({ to: '/orders' })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order #{order.id.toString()}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadOrder}
                  disabled={getOrder.isPending}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${getOrder.isPending ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  {getStatusIcon(order.status)}
                </div>
                <div className="flex-1">
                  <Badge variant={getStatusVariant(order.status)} className="mb-2">
                    {order.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(Number(order.timestamp) / 1000000).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                  <p className="font-semibold">{order.total.toString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">Product ID: {item.productId.toString()}</p>
                    </div>
                    <p className="text-muted-foreground">Qty: {item.quantity.toString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
