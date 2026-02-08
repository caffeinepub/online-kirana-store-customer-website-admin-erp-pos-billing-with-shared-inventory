import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams({ strict: false });

  return (
    <div className="container px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll start processing it right away.
            </p>

            <div className="bg-muted rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Order ID</span>
              </div>
              <p className="text-2xl font-bold">#{orderId}</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full h-12"
                size="lg"
                onClick={() => navigate({ to: '/orders/$orderId', params: { orderId: orderId as string } })}
              >
                Track Order
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-full h-12"
                size="lg"
                onClick={() => navigate({ to: '/orders' })}
              >
                View All Orders
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => navigate({ to: '/' })}
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
