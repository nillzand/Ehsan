// frontend/src/pages/admin/user/UserListPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types'; // Use the updated User type
import { getUsers } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth'; // Import useAuth
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, DollarSign } from 'lucide-react'; // Add DollarSign icon
// NOTE: AllocateBudgetModal would be a new component, we are just setting up the button for it here.

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isCompanyAdmin } = useAuth(); // Check if the current user is a Company Admin
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>در حال بارگذاری کاربران...</p>;

  return (
    <div>
      <PageHeader title="مدیریت کاربران" />
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate('/admin/users/new')}>
          <PlusCircle className="ml-2 h-4 w-4" />
          افزودن کاربر
        </Button>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام</TableHead>
              <TableHead>نام کاربری</TableHead>
              <TableHead>شرکت</TableHead>
              <TableHead>اعتبار فعلی</TableHead>
              <TableHead>عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.company_name}</TableCell>
                <TableCell>{Number(user.budget).toLocaleString('fa-IR')} تومان</TableCell>
                <TableCell className="space-x-2 rtl:space-x-reverse">
                   <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                   {isCompanyAdmin && (
                     <Button variant="outline" size="icon" title="تخصیص اعتبار">
                       <DollarSign className="h-4 w-4 text-green-600" />
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

export default UserListPage;