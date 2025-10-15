// frontend/src/pages/admin/contract/AddEditContractPage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Company, Contract } from '@/types';
import { getContractById, createContract, updateContract } from '@/services/contractService';
import { getCompanies } from '@/services/companyService';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// The data structure used for the form state
type ContractFormData = {
    company: string;
    start_date: string;
    end_date: string;
    status: Contract['status'];
    notes: string;
};

const AddEditContractPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<ContractFormData>({
    company: '',
    start_date: '',
    end_date: '',
    status: 'PENDING',
    notes: '',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const companiesPromise = getCompanies().then(setCompanies);
    
    const contractPromise = isEditMode
      ? getContractById(Number(id)).then(contract => {
          setFormData({
            company: String(contract.company),
            start_date: contract.start_date,
            end_date: contract.end_date,
            status: contract.status,
            notes: contract.notes || '',
          });
        })
      : Promise.resolve();

    Promise.all([companiesPromise, contractPromise])
      .catch(() => setError('خطا در بارگذاری اطلاعات اولیه.'))
      .finally(() => setIsLoading(false));
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof ContractFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company) {
        setError("لطفا یک شرکت را انتخاب کنید.");
        return;
    }
    setIsLoading(true);
    setError(null);

    const payload = {
      ...formData,
      company: parseInt(formData.company),
    };

    try {
      if (isEditMode) {
        await updateContract(Number(id), payload);
      } else {
        await createContract(payload as any);
      }
      navigate('/admin/contracts');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'ذخیره قرارداد ناموفق بود. لطفا فیلدها را بررسی کنید.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !companies.length) return <p>در حال بارگذاری...</p>;

  return (
    <div>
      <PageHeader title={isEditMode ? "ویرایش قرارداد" : "افزودن قرارداد جدید"} />
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات قرارداد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">شرکت</Label>
                <Select
                  value={formData.company}
                  onValueChange={(value) => handleSelectChange('company', value)}
                  required
                >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="یک شرکت را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">وضعیت</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">در انتظار</SelectItem>
                    <SelectItem value="ACTIVE">فعال</SelectItem>
                    <SelectItem value="EXPIRED">منقضی شده</SelectItem>
                    <SelectItem value="CANCELED">لغو شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">تاریخ شروع</Label>
                <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">تاریخ پایان</Label>
                <Input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">یادداشت‌ها</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="شرایط خاص، نکات مهم و..." />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'در حال ذخیره...' : 'ذخیره قرارداد'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AddEditContractPage;