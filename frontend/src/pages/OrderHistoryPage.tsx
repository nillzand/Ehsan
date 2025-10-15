// src/pages/OrderHistoryPage.tsx
import { useEffect, useState } from 'react';
import { getMyOrders, deleteOrder } from '../services/orderService';
import { Order } from '../types';
import { PageHeader } from '../components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '@/components/ui/button';
import { isModificationAllowed } from '@/lib/utils'; // Import the helper

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (err) {
      setError('خطا در دریافت تاریخچه سفارشات شما.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm("آیا از لغو این سفارش مطمئن هستید؟ مبلغ به اعتبار شما بازگردانده خواهد شد.")) {
        return;
    }
    try {
        await deleteOrder(orderId);
        // Refresh the list after successful cancellation
        fetchOrders(); 
    } catch (error: any) {
        alert("خطا در لغو سفارش: " + (error.response?.data?.detail || "لطفا دوباره تلاش کنید."));
    }
  };

  if (isLoading) return <p>در حال بارگذاری سفارشات...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PageHeader title="تاریخچه سفارشات من" />
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => {
            const canModify = isModificationAllowed(order.date);
            return (
                <Card key={order.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>سفارش برای تاریخ {order.date}</CardTitle>
                                <CardDescription>ثبت شده در: {new Date(order.created_at).toLocaleString('fa-IR')}</CardDescription>
                            </div>
                            <Badge>{order.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>غذای اصلی:</strong> {order.food_item.name}</p>
                        {order.side_dishes.length > 0 && (
                        <p><strong>مخلفات:</strong> {order.side_dishes.map(s => s.name).join('، ')}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            disabled={!canModify}
                            onClick={() => handleCancelOrder(order.id)}
                        >
                            لغو سفارش
                        </Button>
                        {!canModify && <p className="text-xs text-muted-foreground mr-4">امکان لغو یا ویرایش سفارش وجود ندارد.</p>}
                    </CardFooter>
                </Card>
            );
          })
        ) : (
          <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;