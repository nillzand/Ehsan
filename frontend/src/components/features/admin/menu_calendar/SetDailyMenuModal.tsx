// frontend/src/components/features/admin/menu_calendar/SetDailyMenuModal.tsx
import React, { useEffect, useState } from 'react';
import { FoodItem, SideDish, DailyMenu } from '@/types';
import { getFoodItems, getSideDishes } from '@/services/foodService';
import { getDailyMenuForDate, saveOrUpdateDailyMenu } from '@/services/menuService';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface SetDailyMenuModalProps {
    date: Date;
    scheduleId: number;
    onClose: () => void;
    onSave: () => void;
}

const toISODateString = (date: Date) => date.toISOString().split('T')[0];

const SetDailyMenuModal: React.FC<SetDailyMenuModalProps> = ({ date, scheduleId, onClose, onSave }) => {
    // ... (rest of the component logic is unchanged) ...
    const [allFoods, setAllFoods] = useState<FoodItem[]>([]);
    const [allSides, setAllSides] = useState<SideDish[]>([]);
    const [existingMenu, setExistingMenu] = useState<DailyMenu | null>(null);
    const [selectedFoods, setSelectedFoods] = useState<Set<number>>(new Set());
    const [selectedSides, setSelectedSides] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const dateStr = toISODateString(date);
            try {
                const [foods, sides, menuForDay] = await Promise.all([
                    getFoodItems(),
                    getSideDishes(),
                    getDailyMenuForDate(scheduleId, dateStr),
                ]);
                
                setAllFoods(foods);
                setAllSides(sides);
                setExistingMenu(menuForDay);

                if (menuForDay) {
                    setSelectedFoods(new Set(menuForDay.available_foods.map(f => f.id)));
                    setSelectedSides(new Set(menuForDay.available_sides.map(s => s.id)));
                } else {
                    setSelectedFoods(new Set());
                    setSelectedSides(new Set());
                }

            } catch (error) {
                console.error("Failed to fetch menu data:", error);
                alert("خطا در بارگذاری اطلاعات منو.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [date, scheduleId]);

    const handleToggleItem = (id: number, type: 'food' | 'side') => {
        const updater = type === 'food' ? setSelectedFoods : setSelectedSides;
        updater(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };
    
    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            date: toISODateString(date),
            available_foods: Array.from(selectedFoods),
            available_sides: Array.from(selectedSides),
        };
        
        try {
          await saveOrUpdateDailyMenu(scheduleId, existingMenu?.id || null, payload);
          alert("منو با موفقیت ذخیره شد!");
          onSave();
          onClose();
        } catch (error) {
          console.error("Failed to save menu:", error);
          alert("خطا در ذخیره منو. لطفا دوباره تلاش کنید.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
                <CardHeader>
                    <CardTitle>تنظیم منو برای تاریخ: {date.toLocaleDateString('fa-IR')}</CardTitle>
                    <CardDescription>غذاها و مخلفات موجود برای این روز را انتخاب کنید.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 gap-8">
                    {isLoading ? <p className="col-span-full">در حال بارگذاری...</p> : (
                        <>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg border-b pb-2">غذاهای اصلی</h3>
                                {allFoods.map(food => (
                                    <div key={food.id} className="flex items-center gap-3">
                                        <Checkbox id={`food-${food.id}`} checked={selectedFoods.has(food.id)} onCheckedChange={() => handleToggleItem(food.id, 'food')} />
                                        <Label htmlFor={`food-${food.id}`} className="cursor-pointer">{food.name}</Label>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-semibold text-lg border-b pb-2">مخلفات</h3>
                                 {allSides.map(side => (
                                    <div key={side.id} className="flex items-center gap-3">
                                        <Checkbox id={`side-${side.id}`} checked={selectedSides.has(side.id)} onCheckedChange={() => handleToggleItem(side.id, 'side')} />
                                        <Label htmlFor={`side-${side.id}`} className="cursor-pointer">{side.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-auto pt-6 border-t">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>انصراف</Button>
                    <Button onClick={handleSave} disabled={isLoading || isSaving}>
                        {isSaving ? 'در حال ذخیره...' : 'ذخیره منو'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SetDailyMenuModal;