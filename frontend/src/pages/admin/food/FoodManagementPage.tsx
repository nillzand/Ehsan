// src/pages/admin/food/FoodManagementPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodItem, FoodCategory } from '@/types';
import { getFoodItems, getFoodCategories } from '@/services/foodService';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';

const FoodManagementPage = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [foodsData, categoriesData] = await Promise.all([getFoodItems(), getFoodCategories()]);
        setFoods(foodsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch food data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (isLoading) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <PageHeader title="مدیریت منو و غذاها" />
      <Tabs defaultValue="foods">
        <TabsList className="mb-4">
          <TabsTrigger value="foods">غذاها</TabsTrigger>
          <TabsTrigger value="categories">دسته بندی ها</TabsTrigger>
        </TabsList>

        {/* Foods Tab */}
        <TabsContent value="foods">
          <div className="flex justify-end mb-4">
            <Button onClick={() => navigate('/admin/foods/new')}>
              <PlusCircle className="ml-2 h-4 w-4" />
              افزودن غذای جدید
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام غذا</TableHead>
                  <TableHead>دسته بندی</TableHead>
                  <TableHead>قیمت (تومان)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {foods.map(food => (
                  <TableRow key={food.id}>
                    <TableCell className="font-medium">{food.name}</TableCell>
                    <TableCell>{food.category_name}</TableCell>
                    <TableCell>{Number(food.price).toLocaleString('fa-IR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
           <div className="flex justify-end mb-4">
            <Button>
              <PlusCircle className="ml-2 h-4 w-4" />
              افزودن دسته بندی
            </Button>
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                 <TableRow>
                   <TableHead>نام دسته بندی</TableHead>
                   <TableHead>توضیحات</TableHead>
                 </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map(cat => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FoodManagementPage;