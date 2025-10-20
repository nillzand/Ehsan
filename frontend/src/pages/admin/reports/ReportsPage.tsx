import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAdminReport } from '@/services/dashboardService';
import { AdminReportData } from '@/types';
import { Users, DollarSign, Package } from 'lucide-react'; // [MODIFIED] Add Package icon

const ReportsPage = () => {
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setError(null);
        const data = await getAdminReport();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch sales report", err);
        setError("خطا در بارگذاری گزارش. لطفا دوباره تلاش کنید.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  // [MODIFIED] Update useMemo to use the correct data key 'sales_by_date'
  const maxOrders = useMemo(() => {
    if (!reportData?.sales_by_date || reportData.sales_by_date.length === 0) {
      return 1; // Avoid division by zero
    }
    // [MODIFIED] Use the 'orders' key instead of 'total_orders'
    return Math.max(...reportData.sales_by_date.map(item => item.orders));
  }, [reportData]);


  if (isLoading) return <p>در حال بارگذاری گزارشات...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reportData) return <p>داده‌ای برای نمایش وجود ندارد.</p>;

  return (
    <div>
      <PageHeader title="گزارشات و آمار" subtitle="تحلیل فروش و سفارشات در ۳۰ روز گذشته" />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">فروش امروز</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* [MODIFIED] Access nested summary object and correct key */}
              {Number(reportData.summary.total_sales_today).toLocaleString('fa-IR')} تومان
            </div>
            <p className="text-xs text-muted-foreground">مجموع فروش ثبت شده برای امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">سفارشات امروز</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* [MODIFIED] Access nested summary object */}
              {reportData.summary.orders_today.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">تعداد سفارش‌های ثبت شده برای امروز</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کاربران فعال</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* [MODIFIED] Access nested user_stats object */}
              {reportData.user_stats.active_last_30_days.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">کاربرانی که در ۳۰ روز گذشته وارد شده‌اند</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>نمودار کلی سفارشات</CardTitle>
          <CardDescription>
            نمایش تعداد سفارشات ثبت شده در ۴ هفته گذشته.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {/* Mock Chart Visualization */}
          <div className="w-full h-72 p-4 space-y-4 flex flex-col justify-end bg-gray-50 rounded-lg">
            {/* [MODIFIED] Use 'sales_by_date' for mapping */}
            {reportData.sales_by_date.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-gray-600">{new Date(item.date).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                   <div 
                     className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm"
                     // [MODIFIED] Use 'orders' key instead of 'total_orders'
                     style={{ inlineSize: `${(item.orders / maxOrders) * 100}%` }}
                   >
                    {item.orders}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;