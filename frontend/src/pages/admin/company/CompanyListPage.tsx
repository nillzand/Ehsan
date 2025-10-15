// frontend/src/pages/admin/company/CompanyListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Company } from '@/types';
import { getCompanies } from '@/services/companyService';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Landmark } from 'lucide-react'; // Add Landmark icon

const CompanyListPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuperAdmin } = useAuth(); // Check for Super Admin role
  const navigate = useNavigate();

  useEffect(() => {
    getCompanies().then(setCompanies).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>در حال بارگذاری شرکت‌ها...</p>;

  return (
    <div>
      <PageHeader title="مدیریت شرکت‌ها" />
      <div className="flex justify-end mb-4">
        {isSuperAdmin && (
            <Button onClick={() => navigate('/admin/companies/new')}>
                <PlusCircle className="ml-2 h-4 w-4" />
                افزودن شرکت
            </Button>
        )}
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام شرکت</TableHead>
              <TableHead>فرد مسئول</TableHead>
              <TableHead>شماره تماس</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.contact_person}</TableCell>
                <TableCell>{company.contact_phone}</TableCell>
                <TableCell className="space-x-2 rtl:space-x-reverse">
                   <Button variant="outline" size="icon" onClick={() => navigate(`/admin/companies/edit/${company.id}`)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                   </Button>
                   {/* Deposit button for Super Admins */}
                   {isSuperAdmin && (
                        <Button variant="outline" size="icon" title="واریز به کیف پول">
                           <Landmark className="h-4 w-4 text-blue-600" />
                        </Button>
                   )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyListPage;