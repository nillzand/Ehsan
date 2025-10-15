// src/components/features/menu/MenuDisplay.tsx
import React, { useState, useMemo } from 'react';
import { DailyMenu } from '@/types';
import { createOrder } from '@/services/orderService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MenuDisplayProps {
  menu: DailyMenu;
  userBudget: number;
  isOrderingDisabled: boolean;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ menu, userBudget, isOrderingDisabled }) => {
  const [selectedFood, setSelectedFood] = useState<number | null>(null);
  const [selectedSides, setSelectedSides] = useState<number[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { totalCost, canAfford } = useMemo(() => {
    const food = menu.available_foods.find(f => f.id === selectedFood);
    const sides = menu.available_sides.filter(s => selectedSides.includes(s.id));
    const foodCost = food ? Number(food.price) : 0;
    const sidesCost = sides.reduce((acc, side) => acc + Number(side.price), 0);
    const total = foodCost + sidesCost;
    return { totalCost: total, canAfford: total <= userBudget };
  }, [selectedFood, selectedSides, menu, userBudget]);

  const handleSideDishToggle = (sideId: number) => {
    setSelectedSides(prev =>
      prev.includes(sideId) ? prev.filter(id => id !== sideId) : [...prev, sideId]
    );
  };

  const handleSubmitOrder = async () => {
    if (!selectedFood) {
      setMessage({ type: 'error', text: 'لطفاً غذای اصلی را انتخاب کنید.' });
      return;
    }
    if (!canAfford) {
      setMessage({ type: 'error', text: 'اعتبار شما برای ثبت این سفارش کافی نیست.' });
      return;
    }
    setMessage(null);

    try {
      await createOrder({
        daily_menu: menu.id,
        food_item: selectedFood,
        side_dishes: selectedSides,
      });
      setMessage({ type: 'success', text: 'سفارش شما با موفقیت ثبت شد!' });
      // You might want to refresh user budget here
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = Object.values(errorData).flat().join(' ') || 'ثبت سفارش ناموفق بود.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  if (isOrderingDisabled) {
      return (
          <Card>
              <CardHeader>
                <CardTitle>مهلت ثبت سفارش تمام شده است</CardTitle>
              </CardHeader>
              <CardContent>
                <p>امکان ثبت یا تغییر سفارش برای امروز وجود ندارد. لطفاً حداقل ۲ روز زودتر اقدام فرمایید.</p>
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ثبت سفارش برای تاریخ {menu.date}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Food Selection */}
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">غذاهای اصلی</h3>
            {menu.available_foods.map((food) => (
                <div key={food.id}
                     className={`flex items-center p-3 rounded-md cursor-pointer border ${selectedFood === food.id ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}
                     onClick={() => setSelectedFood(food.id)}>
                    <p className="font-medium flex-grow">{food.name}</p>
                    <p className="text-sm text-gray-600">{Number(food.price).toLocaleString('fa-IR')} تومان</p>
                </div>
            ))}
        </div>

        {/* Side Dish Selection */}
        {menu.available_sides.length > 0 && (
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">مخلفات (اختیاری)</h3>
                {menu.available_sides.map((side) => (
                    <div key={side.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Checkbox id={`side-${side.id}`} onCheckedChange={() => handleSideDishToggle(side.id)} />
                        <Label htmlFor={`side-${side.id}`} className="flex-grow cursor-pointer">{side.name} (+{Number(side.price).toLocaleString('fa-IR')} تومان)</Label>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <div className="w-full text-lg font-semibold">
            <p>مجموع هزینه: {totalCost.toLocaleString('fa-IR')} تومان</p>
            {!canAfford && <p className="text-sm text-red-500">اعتبار شما ({userBudget.toLocaleString('fa-IR')} تومان) کافی نیست.</p>}
        </div>
        {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message.text}
            </p>
        )}
        <Button onClick={handleSubmitOrder} disabled={!selectedFood || !canAfford}>ثبت نهایی سفارش</Button>
      </CardFooter>
    </Card>
  );
};