// frontend/src/pages/admin/schedule/ScheduleListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Schedule } from '@/types';
import { getSchedules } from '@/services/scheduleService';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const ScheduleListPage = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        getSchedules()
            .then(setSchedules)
            .catch(() => setError('خطا در دریافت لیست برنامه‌های غذایی.'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <p>در حال بارگذاری برنامه‌ها...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <PageHeader title="برنامه‌های غذایی شرکت‌ها" />
            <div className="flex justify-end mb-4">
                <Button onClick={() => navigate('/admin/schedules/new')}>
                    <PlusCircle className="ml-2 h-4 w-4" />
                    افزودن برنامه جدید
                </Button>
            </div>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>نام برنامه</TableHead>
                            <TableHead>شرکت</TableHead>
                            <TableHead>تاریخ شروع</TableHead>
                            <TableHead>تاریخ پایان</TableHead>
                            <TableHead>وضعیت</TableHead>
                            <TableHead>عملیات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {schedules.map((schedule) => (
                            <TableRow key={schedule.id}>
                                <TableCell className="font-medium">{schedule.name}</TableCell>
                                <TableCell>{schedule.company_name}</TableCell>
                                <TableCell>{new Date(schedule.start_date).toLocaleDateString('fa-IR')}</TableCell>
                                <TableCell>{new Date(schedule.end_date).toLocaleDateString('fa-IR')}</TableCell>
                                <TableCell>
                                    <Badge variant={schedule.is_active ? 'default' : 'outline'}>
                                        {schedule.is_active ? 'فعال' : 'غیرفعال'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 rtl:space-x-reverse">
                                   {/* The edit functionality will be added in the next step */}
                                   <Button variant="outline" size="icon" onClick={() => navigate(`/admin/schedules/edit/${schedule.id}`)}>
                                      <Edit className="h-4 w-4" />
                                   </Button>
                                   <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                   </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default ScheduleListPage;