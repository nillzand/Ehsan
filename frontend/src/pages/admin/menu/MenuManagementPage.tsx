// src/pages/admin/menu/MenuManagementPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { FoodItem, Schedule, SideDish } from '@/types';

import { getSchedules } from '@/services/scheduleService';
import { getFoodItems, getSideDishes } from '@/services/foodService';
// [MODIFIED] Correct function is already imported, but the call was wrong.
import { getDailyMenuForDate, saveOrUpdateDailyMenu } from '@/services/menuService';

const MenuManagementPage = () => {
    // Data states for holding lists from the backend
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [sides, setSides] = useState<SideDish[]>([]);

    // State for user's selections
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedFoodIds, setSelectedFoodIds] = useState<Set<number>>(new Set());
    const [selectedSideIds, setSelectedSideIds] = useState<Set<number>>(new Set());
    
    // [NEW] Add state to hold the ID of an existing menu for the selected date
    const [existingMenuId, setExistingMenuId] = useState<number | null>(null);

    // UI states for loading, messages, and filtering
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMenu, setIsFetchingMenu] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [foodFilter, setFoodFilter] = useState('');
    const [sideFilter, setSideFilter] = useState('');

    // 1. Fetch initial data when the page loads
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [schedulesData, foodsData, sidesData] = await Promise.all([
                    getSchedules(),
                    getFoodItems(),
                    getSideDishes()
                ]);
                setSchedules(schedulesData);
                setFoods(foodsData);
                setSides(sidesData);
            } catch (error) {
                setMessage({ type: 'error', text: 'Error loading initial data.' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Fetch the specific daily menu whenever the selected schedule or date changes
    useEffect(() => {
        const fetchDailyMenu = async () => {
            if (!selectedScheduleId || !selectedDate) return;
            
            setIsFetchingMenu(true);
            setMessage(null);
            try {
                const menu = await getDailyMenuForDate(Number(selectedScheduleId), selectedDate);
                if (menu) {
                    // If a menu exists, pre-fill the checkboxes and store its ID
                    setExistingMenuId(menu.id);
                    setSelectedFoodIds(new Set(menu.available_foods.map(f => f.id)));
                    setSelectedSideIds(new Set(menu.available_sides.map(s => s.id)));
                } else {
                    // Otherwise, clear the selections and the ID
                    setExistingMenuId(null);
                    setSelectedFoodIds(new Set());
                    setSelectedSideIds(new Set());
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Error fetching daily menu.' });
            } finally {
                setIsFetchingMenu(false);
            }
        };
        fetchDailyMenu();
    }, [selectedScheduleId, selectedDate]);

    // Handles toggling a checkbox for a food or side dish
    const handleItemToggle = (id: number, type: 'food' | 'side') => {
        const updater = type === 'food' ? setSelectedFoodIds : setSelectedSideIds;
        updater(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    // 3. Handles saving the menu
    const handleSubmit = async () => {
        if (!selectedScheduleId || !selectedDate) {
            setMessage({ type: 'error', text: 'Please select a schedule and date.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            // [FIXED] Use the correct function 'saveOrUpdateDailyMenu' with the correct arguments
            const payload = {
                date: selectedDate,
                available_foods: Array.from(selectedFoodIds),
                available_sides: Array.from(selectedSideIds),
            };
            await saveOrUpdateDailyMenu(
                Number(selectedScheduleId),
                existingMenuId, // Pass the existing menu ID (or null if it's new)
                payload
            );
            setMessage({ type: 'success', text: 'Menu saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save menu.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Memoized filters for better performance
    const filteredFoods = useMemo(() => 
        foods.filter(f => f.name.toLowerCase().includes(foodFilter.toLowerCase())),
    [foods, foodFilter]);

    const filteredSides = useMemo(() =>
        sides.filter(s => s.name.toLowerCase().includes(sideFilter.toLowerCase())),
    [sides, sideFilter]);

    return (
        <div>
            <PageHeader title="Daily Menu Management" subtitle="Define the available meals for a specific date." />

            {/* Step 1: Selection Area */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>1. Select Schedule and Date</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="schedule">Food Schedule</Label>
                        <Select onValueChange={setSelectedScheduleId} value={selectedScheduleId}>
                            <SelectTrigger id="schedule" disabled={isLoading}>
                                <SelectValue placeholder="Select a schedule" />
                            </SelectTrigger>
                            <SelectContent>
                                {schedules.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>{s.name} ({s.company_name})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} disabled={isLoading || !selectedScheduleId} />
                    </div>
                </CardContent>
            </Card>

            {/* Step 2: Menu Definition Area */}
            {selectedScheduleId && selectedDate && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. Set the Menu</CardTitle>
                        <CardDescription>Select the foods and sides available for {selectedDate}.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isFetchingMenu ? <p>Loading existing menu...</p> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Main Foods List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Main Foods</h3>
                                    <Input placeholder="Search foods..." value={foodFilter} onChange={e => setFoodFilter(e.target.value)} />
                                    <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                                        {filteredFoods.map(food => (
                                            <div key={food.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <Checkbox id={`food-${food.id}`} checked={selectedFoodIds.has(food.id)} onCheckedChange={() => handleItemToggle(food.id, 'food')} />
                                                <Label htmlFor={`food-${food.id}`} className="flex-grow cursor-pointer">{food.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Side Dishes List */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Side Dishes</h3>
                                    <Input placeholder="Search sides..." value={sideFilter} onChange={e => setSideFilter(e.target.value)} />
                                     <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                                        {filteredSides.map(side => (
                                            <div key={side.id} className="flex items-center space-x-3 rtl:space-x-reverse">
                                                <Checkbox id={`side-${side.id}`} checked={selectedSideIds.has(side.id)} onCheckedChange={() => handleItemToggle(side.id, 'side')} />
                                                <Label htmlFor={`side-${side.id}`} className="flex-grow cursor-pointer">{side.name}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {message && <p className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
                        
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSubmit} disabled={isLoading || isFetchingMenu}>
                                {isLoading ? 'Saving...' : 'Save Menu'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MenuManagementPage;