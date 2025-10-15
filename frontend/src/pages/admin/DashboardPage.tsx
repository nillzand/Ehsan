import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/dashboardService';
import { DashboardStats } from '../../types';
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('خطا در دریافت آمار داشبورد.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <p>در حال بارگذاری داشبورد...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <PageHeader title="داشبورد ادمین" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              سفارشات امروز
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders_today}</div>
            <p className="text-xs text-muted-foreground">
              تعداد کل سفارشات ثبت‌شده برای امروز.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              سفارشات در انتظار تایید
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_orders_total}</div>
            <p className="text-xs text-muted-foreground">
              سفارش‌هایی که هنوز تایید نهایی نشده‌اند.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">۵ غذای محبوب</h2>
        <Card>
          <CardHeader>
            <CardTitle>پرفروش‌ترین غذاها</CardTitle>
            <CardDescription>
              بر اساس تعداد کل سفارشات ثبت‌شده.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {stats?.top_5_foods.map((food, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="font-medium">{food.name}</span>
                  <span className="text-lg font-semibold">{food.count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;