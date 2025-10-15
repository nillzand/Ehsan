// src/pages/admin/company/AddEditCompanyPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Company } from '@/types';
import { getCompanyById } from '@/services/companyService';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AddEditCompanyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Partial<Company>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      setIsLoading(true);
      getCompanyById(Number(id))
        .then(data => {
          if (data) setCompany(data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving company:", company);
    navigate('/admin/companies');
  };

  if (isLoading) return <p>در حال بارگذاری اطلاعات شرکت...</p>;

  return (
    <div>
      <PageHeader title={isEditMode ? `ویرایش شرکت: ${company.name}` : "افزودن شرکت جدید"} />
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader><CardTitle>اطلاعات</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">نام شرکت</Label>
                <Input id="name" value={company.name || ''} onChange={e => setCompany({...company, name: e.target.value})} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="contact_person">نام ادمین</Label>
                <Input id="contact_person" value={company.contact_person || ''} onChange={e => setCompany({...company, contact_person: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">شماره تماس</Label>
                <Input id="contact_phone" value={company.contact_phone || ''} onChange={e => setCompany({...company, contact_phone: e.target.value})} />
              </div>
               <div className="space-y-2 col-span-full">
                <Label htmlFor="address">آدرس</Label>
                <Input id="address" value={company.address || ''} onChange={e => setCompany({...company, address: e.target.value})} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>دسترسی‌ها</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-semibold">دسترسی کاربر</h3>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox id="can_view_my_orders" />
                <Label htmlFor="can_view_my_orders">سفارشات من</Label>
              </div>
               <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox id="can_view_wallet" />
                <Label htmlFor="can_view_wallet">کیف پول</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">ذخیره تغییرات</Button>
        </div>
      </form>
    </div>
  );
};

export default AddEditCompanyPage;