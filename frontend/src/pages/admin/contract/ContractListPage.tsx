// frontend/src/pages/admin/contract/ContractListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract } from '@/types';
import { getContracts, deleteContract } from '@/services/contractService';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const ContractListPage = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchContracts = () => {
    setIsLoading(true);
    getContracts()
      .then(setContracts)
      .catch(() => setError('خطا در دریافت لیست قراردادها.'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('آیا از حذف این قرارداد مطمئن هستید؟')) {
      try {
        await deleteContract(id);
        fetchContracts(); // Refresh the list after deletion
      } catch (err) {
        alert('حذف قرارداد ناموفق بود.');
      }
    }
  };

  const getStatusVariant = (status: Contract['status']): 'default' | 'secondary' | 'outline' | 'destructive' => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'PENDING': return 'secondary';
      case 'EXPIRED': return 'outline';
      case 'CANCELED': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) return <p>در حال بارگذاری قراردادها...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <PageHeader title="مدیریت قراردادها" />
      <div className="flex justify-end mb-6">
        <Button onClick={() => navigate('/admin/contracts/new')}>
          <PlusCircle className="ml-2 h-4 w-4" />
          افزودن قرارداد جدید
        </Button>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شرکت</TableHead>
              <TableHead>تاریخ شروع</TableHead>
              <TableHead>تاریخ پایان</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.company_name}</TableCell>
                <TableCell>{new Date(contract.start_date).toLocaleDateString('fa-IR')}</TableCell>
                <TableCell>{new Date(contract.end_date).toLocaleDateString('fa-IR')}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(contract.status)}>
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 rtl:space-x-reverse">
                   <Button variant="outline" size="icon" onClick={() => navigate(`/admin/contracts/edit/${contract.id}`)}>
                      <Edit className="h-4 w-4" />
                   </Button>
                   <Button variant="destructive" size="icon" onClick={() => handleDelete(contract.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContractListPage;