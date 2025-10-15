// frontend/src/components/features/admin/MenuCalendarPage.tsx
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * A placeholder page for the future Menu Calendar feature.
 * This component resolves the missing module error in App.tsx.
 */
const MenuCalendarPage = () => {
  return (
    <div>
      <PageHeader
        title="تقویم منو"
        subtitle="در این بخش می‌توانید منوی روزانه شرکت‌های مختلف را مشاهده و مدیریت کنید."
      />
      <Card>
        <CardHeader>
          <CardTitle>در دست ساخت</CardTitle>
          <CardDescription>
            این صفحه برای نمایش و مدیریت منوهای غذایی در یک نمای تقویمی طراحی خواهد شد.
            در حال حاضر، برای تعریف منوی روزانه می‌توانید از صفحه "Menu Management" استفاده کنید.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>ویژگی‌های آینده:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>نمایش تقویم ماهانه</li>
            <li>کشیدن و رها کردن غذاها برای تنظیم منو</li>
            <li>کپی کردن منوی یک روز به روز دیگر</li>
            <li>نمایش وضعیت منو (تکمیل شده / ناقص)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuCalendarPage;
