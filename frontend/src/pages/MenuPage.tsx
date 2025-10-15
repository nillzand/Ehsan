// frontend/src/pages/MenuPage.tsx
import { useEffect, useState } from 'react';
import { getMyCompanyMenu } from '../services/menuService';
import { getCurrentUser } from '../services/userService';
// [FIXED] Removed the non-existent 'getSchedules' import
import { getCompanies } from '@/services/companyService'; 
import { Schedule, User, Company } from '../types';
import { PageHeader } from '../components/shared/PageHeader';
import { MenuDisplay } from '../components/features/menu/MenuDisplay';
import { isModificationAllowed } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

const MenuPage = () => {
  const { isSuperAdmin, isCompanyAdmin } = useAuth();
  
  // States for all roles
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for Employee and Company Admin
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // States for Super Admin
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSuperAdmin) {
          // Super Admin fetches all companies and all schedules.
          // The backend's getMyCompanyMenu returns all schedules for a super admin.
          const [companies, schedules] = await Promise.all([getCompanies(), getMyCompanyMenu()]);
          setAllCompanies(companies);
          setAllSchedules(schedules);
        } else {
          // Employees and Company Admins fetch their own data
          const [schedules, user] = await Promise.all([getMyCompanyMenu(), getCurrentUser()]);
          if (schedules.length > 0) {
            setSchedule(schedules[0]);
          }
          setCurrentUser(user);
        }
      } catch (err) {
        setError('خطا در بارگذاری اطلاعات. لطفاً بعداً تلاش کنید.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isSuperAdmin]);

  if (isLoading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // === SUPER ADMIN VIEW ===
  if (isSuperAdmin) {
    const selectedSchedule = allSchedules.find(s => s.company === parseInt(selectedCompanyId));
    const todaysMenu = selectedSchedule?.daily_menus.find(m => m.date === new Date().toISOString().split('T')[0]);

    return (
      <div>
        <PageHeader title="مشاهده منو شرکت‌ها" subtitle="یک شرکت را برای دیدن منوی فعال آن انتخاب کنید." />
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="company-select">انتخاب شرکت</Label>
              <Select onValueChange={setSelectedCompanyId} value={selectedCompanyId}>
                <SelectTrigger id="company-select">
                  <SelectValue placeholder="یک شرکت را انتخاب کنید..." />
                </SelectTrigger>
                <SelectContent>
                  {allCompanies.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedCompanyId && todaysMenu && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">منوی امروز برای: {selectedSchedule?.company_name}</h2>
            {/* Super Admins only view, so ordering is disabled */}
            <MenuDisplay menu={todaysMenu} userBudget={0} isOrderingDisabled={true} />
          </div>
        )}
        {selectedCompanyId && !todaysMenu && <p className="mt-6">برای این شرکت، منوی فعالی برای امروز یافت نشد.</p>}
      </div>
    );
  }

  // === EMPLOYEE & COMPANY ADMIN VIEW ===
  if (!schedule || !currentUser) return <p>هیچ منوی فعالی برای شرکت شما یافت نشد.</p>;

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysMenu = schedule.daily_menus.find(menu => menu.date === todayStr);
  // Company Admins should be able to view the menu even if ordering is disabled for employees.
  const isOrderingDisabledForRole = isCompanyAdmin ? false : !todaysMenu || !isModificationAllowed(todaysMenu.date);

  return (
    <div>
      <PageHeader title="منوی امروز" subtitle={`برای شرکت ${schedule.company_name}`} />
      {todaysMenu ? (
        <MenuDisplay
          menu={todaysMenu}
          userBudget={Number(currentUser.budget)}
          isOrderingDisabled={isOrderingDisabledForRole}
        />
      ) : (
        <p>متاسفانه برای امروز منویی تعریف نشده است.</p>
      )}
    </div>
  );
};

export default MenuPage;