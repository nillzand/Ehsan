// src/pages/admin/menu_calendar/MenuCalendarPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { CalendarGrid } from '@/components/features/admin/menu_calendar/CalendarGrid';
import { SetDailyMenuModal } from '@/components/features/admin/menu_calendar/SetDailyMenuModal';

const MenuCalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSelectDay = (day: Date) => {
        setSelectedDate(day);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
        // Here you would typically refetch the calendar data to show updates
    };

    return (
        <div>
            <PageHeader 
                title="تقویم و مدیریت منو"
                subtitle="برای افزودن یا ویرایش منوی روزانه، روی یک روز کلیک کنید."
            />
            
            <CalendarGrid onSelectDay={handleSelectDay} />

            {isModalOpen && selectedDate && (
                <SetDailyMenuModal
                    date={selectedDate}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default MenuCalendarPage;