// frontend/src/pages/admin/schedule/AddEditSchedulePage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company } from '@/types';
import { getCompanies } from '@/services/companyService';
import { createSchedule } from '@/services/scheduleService';

const AddEditSchedulePage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        getCompanies().then(setCompanies);
        // In a real edit mode, you would also fetch the specific schedule data here
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !companyId || !startDate || !endDate) {
            setError("لطفاً تمام فیلدها را پر کنید.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await createSchedule({
                name,
                company: parseInt(companyId),
                start_date: startDate,
                end_date: endDate,
                is_active: true, // Default to active for new schedules
            });
            navigate('/admin/schedules');
        } catch (err) {
            setError("خطا در ذخیره برنامه. لطفا تاریخ‌ها را بررسی کنید.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PageHeader title={isEditMode ? "ویرایش برنامه غذایی" : "افزودن برنامه غذایی جدید"} />
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>اطلاعات کلی برنامه</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">نام برنامه</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="مثلا: برنامه ماهانه" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="company">شرکت</Label>
                        <Select onValueChange={setCompanyId} value={companyId} required>
                            <SelectTrigger id="company">
                                <SelectValue placeholder="یک شرکت را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="startDate">تاریخ شروع</Label>
                        <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="endDate">تاریخ پایان</Label>
                        <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                    </div>
                </CardContent>
            </Card>

            {error && <p className="text-sm text-red-500 my-4">{error}</p>}

            <div className="mt-6 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'در حال ذخیره...' : 'ذخیره برنامه'}
                </Button>
            </div>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>مرحله بعد: تنظیم منوی روزانه</CardTitle>
                    <CardDescription>
                        پس از ذخیره برنامه، می‌توانید از طریق پنل ادمین جنگو برای هر روز غذاهای مورد نظر را اضافه کنید.
                    </CardDescription>
                </CardHeader>
            </Card>
        </form>
    );
};

export default AddEditSchedulePage;