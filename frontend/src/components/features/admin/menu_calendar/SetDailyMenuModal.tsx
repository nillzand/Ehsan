import React, { useEffect, useState } from 'react';
import { FoodItem } from '@/types';
import { getFoodItems } from '@/services/foodService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface SetDailyMenuModalProps {
    date: Date;
    onClose: () => void;
}

export const SetDailyMenuModal: React.FC<SetDailyMenuModalProps> = ({ date, onClose }) => {
    const [allFoods, setAllFoods] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedFoods, setSelectedFoods] = useState<Map<number, number>>(new Map()); // Map<foodId, discount>

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch all available food items
                const foods = await getFoodItems();
                setAllFoods(foods);
                
                // 2. [Future] Fetch existing menu for the selected date to pre-fill the form
                // e.g., const existingMenu = await getMenuForDate(date);
                // if (existingMenu) {
                //     const initialSelection = new Map();
                //     existingMenu.items.forEach(item => {
                //         initialSelection.set(item.food_id, item.discount_percentage);
                //     });
                //     setSelectedFoods(initialSelection);
                // }
            } catch (error) {
                console.error("Failed to fetch food items:", error);
                // Handle error appropriately
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [date]);

    const handleToggleFood = (foodId: number, isChecked: boolean) => {
        const newSelection = new Map(selectedFoods);
        if (isChecked) {
            newSelection.set(foodId, 0); // Add with 0% discount by default
        } else {
            newSelection.delete(foodId);
        }
        setSelectedFoods(newSelection);
    };

    const handleDiscountChange = (foodId: number, discountStr: string) => {
        const newSelection = new Map(selectedFoods);
        if (discountStr === '') {
             newSelection.set(foodId, 0); // Treat empty string as 0
        } else {
            const discountValue = parseInt(discountStr, 10);
            if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
                newSelection.set(foodId, discountValue);
            }
        }
        setSelectedFoods(newSelection);
    };
    
    const handleSave = async () => {
        // [Backend Required] This is where you would call the backend API
        const payload = {
            date: date.toISOString().split('T')[0],
            menu_items: Array.from(selectedFoods.entries()).map(([food_id, discount]) => ({ 
                food_id, 
                discount_percentage: discount 
            }))
        };
        console.log("Saving menu:", payload);
        // try {
        //   await saveOrUpdateDailyMenu(payload);
        //   alert("منو با موفقیت ذخیره شد!");
        //   onClose();
        // } catch (error) {
        //   alert("خطا در ذخیره منو.");
        // }
        alert("منو با موفقیت ذخیره شد! (شبیه‌سازی)");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col">
                <CardHeader>
                    <CardTitle>تنظیم منو برای تاریخ: {date.toLocaleDateString('fa-IR')}</CardTitle>
                    <CardDescription>غذاهای مورد نظر را انتخاب کرده و در صورت تمایل، درصد تخفیف را وارد کنید.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-y-auto space-y-4">
                    {isLoading ? <p>در حال بارگذاری غذاها...</p> : (
                        <div className="space-y-3">
                            {allFoods.map(food => {
                                const isSelected = selectedFoods.has(food.id);
                                return (
                                    <div key={food.id} className={`flex items-center gap-4 p-3 border rounded-lg transition-colors ${isSelected ? 'bg-muted' : ''}`}>
                                        <Checkbox
                                            id={`food-${food.id}`}
                                            checked={isSelected}
                                            onCheckedChange={(checked) => handleToggleFood(food.id, Boolean(checked))}
                                            className="size-5"
                                        />
                                        <Label htmlFor={`food-${food.id}`} className="flex-grow font-medium text-base cursor-pointer">{food.name}</Label>
                                        <div className="flex items-center gap-2 w-40">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="تخفیف"
                                                disabled={!isSelected}
                                                value={isSelected ? (selectedFoods.get(food.id) || 0) : ''}
                                                onChange={(e) => handleDiscountChange(food.id, e.target.value)}
                                                className="w-full disabled:bg-background"
                                            />
                                            <span className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-50'}`}>%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2 mt-auto pt-6 border-t">
                    <Button variant="outline" onClick={onClose}>انصراف</Button>
                    <Button onClick={handleSave} disabled={isLoading}>ذخیره منو</Button>
                </CardFooter>
            </Card>
        </div>
    );
};