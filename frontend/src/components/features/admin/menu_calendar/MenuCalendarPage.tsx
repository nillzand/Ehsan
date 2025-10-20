// frontend/src/components/features/admin/menu_calendar/MenuCalendarPage.tsx
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { CalendarGrid } from '@/components/features/admin/menu_calendar/CalendarGrid';
import SetDailyMenuModal from '@/components/features/admin/menu_calendar/SetDailyMenuModal';
import { Schedule } from '@/types';
import { getSchedules } from '@/services/scheduleService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from '@/components/ui/card';

const MenuCalendarPage = () => {
    // Data state
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    
    // UI State
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch all available schedules when the component mounts
        getSchedules()
            .then(setSchedules)
            .catch(err => console.error("Failed to fetch schedules", err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSelectDay = (day: Date) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };
    
    const handleSaveSuccess = () => {
        // This function is called after a successful save.
        // You can add logic here to refetch data if needed.
        console.log("Menu saved, modal will close.");
    };

    return (
        <div>
            <PageHeader 
                title="تقویم و مدیریت منو"
                subtitle="یک برنامه غذایی را انتخاب کرده، سپس برای افزودن یا ویرایش منوی روزانه، روی یک روز کلیک کنید."
            />
            
            <Card className="mb-6 max-w-md">
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="schedule-select">برنامه غذایی شرکت</Label>
                        <Select onValueChange={setSelectedScheduleId} value={selectedScheduleId} disabled={isLoading}>
                             <SelectTrigger id="schedule-select">
                                <SelectValue placeholder="یک برنامه را انتخاب کنید..." />
                            </SelectTrigger>
                            <SelectContent>
                                {schedules.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.company_name} - {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Only show the calendar if a schedule has been selected */}
            {selectedScheduleId ? (
                 <CalendarGrid onSelectDay={handleSelectDay} />
            ) : (
                <p className="text-muted-foreground">برای نمایش تقویم، ابتدا یک برنامه غذایی را انتخاب کنید.</p>
            )}

            {isModalOpen && selectedDate && selectedScheduleId && (
                <SetDailyMenuModal
                    date={selectedDate}
                    scheduleId={Number(selectedScheduleId)}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default MenuCalendarPage;