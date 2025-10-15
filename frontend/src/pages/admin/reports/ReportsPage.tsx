import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAdminReport } from '@/services/dashboardService';
import { AdminReportData } from '@/types';
import { Users, DollarSign } from 'lucide-react';

const ReportsPage = () => {
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold fetch errors

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setError(null); // Reset error state on new fetch
        const data = await getAdminReport();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch sales report", err);
        setError("خطا در بارگذاری گزارش. لطفا دوباره تلاش کنید."); // Set user-facing error message
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  // useMemo will calculate the max value only when reportData changes
  const maxOrders = useMemo(() => {
    if (!reportData?.chart_data || reportData.chart_data.length === 0) {
      return 1; // Avoid division by zero
    }
    // Find the highest total_orders in the chart data
    return Math.max(...reportData.chart_data.map(item => item.total_orders));
  }, [reportData]);


  if (isLoading) return <p>در حال بارگذاری گزارشات...</p>;
  if (error) return <p className="text-red-500">{error}</p>; // Display the error in the UI
  if (!reportData) return <p>داده‌ای برای نمایش وجود ندارد.</p>;

  return (
    <div>
      <PageHeader title="گزارشات و آمار" subtitle="تحلیل فروش و سفارشات در ۳۰ روز گذشته" />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع درآمد</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.total_revenue_last_30_days.toLocaleString('fa-IR')} تومان
            </div>
            <p className="text-xs text-muted-foreground">درآمد کل در ۳۰ روز گذشته</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین سفارشات روزانه</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.average_daily_orders.toLocaleString('fa-IR')}
            </div>
            <p className="text-xs text-muted-foreground">میانگین تعداد سفارشات در روز</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>نمودار کلی سفارشات</CardTitle>
          <CardDescription>
            نمایش تعداد سفارشات ثبت شده در ۴ هفته گذشته.
            <br />
            <span className="text-xs text-muted-foreground">
              (نکته: برای نمایش نمودار واقعی، به یک کتابخانه مانند Recharts نیاز است)
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {/* Mock Chart Visualization */}
          <div className="w-full h-72 p-4 space-y-4 flex flex-col justify-end bg-gray-50 rounded-lg">
            {reportData.chart_data.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm font-medium text-gray-600">{item.date}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-8">
                   <div 
                     className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2 text-white text-sm"
                     style={{ inlineSize: `${(item.total_orders / maxOrders) * 100}%` }} // Using dynamic maxOrders
                   >
                    {item.total_orders}
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