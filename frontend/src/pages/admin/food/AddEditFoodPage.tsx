// src/pages/admin/food/AddEditFoodPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFoodCategories, createFoodItem } from '@/services/foodService';
import { FoodCategory } from '@/types';

const AddEditFoodPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<FoodCategory[]>([]);
    
    // Form State
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<string>('');

    useEffect(() => {
        getFoodCategories().then(setCategories);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !categoryId) {
            alert('لطفا تمام فیلدهای اجباری را پر کنید.');
            return;
        }
        try {
            await createFoodItem({
                name,
                price,
                description,
                category: parseInt(categoryId),
                image: null, // Image upload is a future task
                is_available: true,
            });
            navigate('/admin/foods');
        } catch (error) {
            console.error("Failed to create food item", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PageHeader title="افزودن غذای جدید" />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">نام غذا</Label>
                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="category">دسته بندی</Label>
                    <Select onValueChange={setCategoryId} required>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="یک دسته بندی را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">قیمت (به تومان)</Label>
                    <Input id="price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">توضیحات</Label>
                    <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="flex justify-end">
                    <Button type="submit">ذخیره غذا</Button>
                </div>
            </div>
        </form>
    );
};

export default AddEditFoodPage;