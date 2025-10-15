import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
    onSelectDay: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ onSelectDay }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Adjust for Persian calendar (Saturday is the first day of the week)
    // In JS, getDay() is 0=Sun, 1=Mon,..., 6=Sat. We want Sat to be index 0.
    const startDayOfWeek = (startOfMonth.getDay() + 1) % 7; 

    const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDayOfWeek });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const today = new Date();
    today.setHours(0,0,0,0);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <Button variant="outline" size="icon" onClick={handlePrevMonth}><ChevronRight /></Button>
                <CardTitle className="text-xl">
                    {currentDate.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })}
                </CardTitle>
                <Button variant="outline" size="icon" onClick={handleNextMonth}><ChevronLeft /></Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-muted-foreground">
                    <div>شنبه</div>
                    <div>یکشنبه</div>
                    <div>دوشنبه</div>
                    <div>سه‌شنبه</div>
                    <div>چهارشنبه</div>
                    <div>پنجشنبه</div>
                    <div>جمعه</div>
                </div>
                <div className="grid grid-cols-7 gap-2 mt-2">
                    {emptyDays.map((_, index) => <div key={`empty-${index}`} />)}
                    {daysInMonth.map(day => {
                        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const isToday = date.getTime() === today.getTime();
                        return (
                            <div
                                key={day}
                                onClick={() => onSelectDay(date)}
                                className={`p-2 h-24 border rounded-md flex flex-col items-start cursor-pointer transition-colors hover:bg-accent ${isToday ? 'border-primary border-2' : ''}`}
                            >
                                <span className="font-bold">{day}</span>
                                {/* In a real app, you would fetch and show which days have menus */}
                                {/* <span className="text-xs text-green-600 mt-auto">منو دارد</span> */}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
