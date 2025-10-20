// frontend/src/components/shared/Layout.tsx
import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentUser } from '@/services/userService';
import { User } from '@/types';
import { Button } from '@/components/ui/button';

export const Layout = () => {
    const { user, isSuperAdmin, isCompanyAdmin, logout } = useAuth();
    const [fullUser, setFullUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !isSuperAdmin && !isCompanyAdmin) {
            getCurrentUser().then(setFullUser).catch(console.error);
        }
    }, [user, isSuperAdmin, isCompanyAdmin]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = 'block text-white text-center text-lg py-3 hover:bg-white/10 transition-colors rounded-md';
    const activeLinkClasses = 'bg-white/20';

    const employeeLinks = [
        { to: '/menu', text: 'ثبت سفارش' },
        { to: '/orders', text: 'سفارشات من' },
    ];

    const companyAdminLinks = [
        { to: '/admin/dashboard', text: 'داشبورد' },
        { to: '/menu', text: 'مشاهده منو' },
        { to: '/admin/wallet/my-company', text: 'کیف پول شرکت' },
        { to: '/admin/users', text: 'مدیریت کاربران' },
    ];

    const superAdminLinks = [
        { to: '/admin/dashboard', text: 'داشبورد' },
        { to: '/menu', text: 'مشاهده منو شرکت‌ها' },
        { to: '/admin/companies', text: 'مدیریت شرکت‌ها' },
        { to: '/admin/contracts', text: 'مدیریت قراردادها' },
        { to: '/admin/foods', text: 'مدیریت غذا' },
        // [MODIFIED] Link updated to the new calendar page
        { to: '/admin/menu-calendar', text: 'تقویم منو' },
        { to: '/admin/users', text: 'مدیریت کاربران' },
        { to: '/admin/reports', text: 'گزارشات' },
    ];

    const links = isSuperAdmin ? superAdminLinks : isCompanyAdmin ? companyAdminLinks : employeeLinks;

    return (
        <div className="min-h-screen flex flex-row bg-gray-100">
            <aside className="w-64 bg-[#88b9d0] flex flex-col p-4 shadow-lg text-white">
                <div className="flex flex-col items-center mt-4 mb-8">
                    <img
                        src="/logo.png"
                        alt="لوگو احسان"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                    />
                </div>

                <div className="text-center mb-10">
                    <h2 className="font-light">سامانه سفارش غذا</h2>
                    <p className="font-bold text-lg mt-1">
                        {user?.username} خوش آمدی!
                    </p>
                    {fullUser && (
                        <p className="text-sm mt-2">
                            اعتبار شما: {Number(fullUser.budget).toLocaleString('fa-IR')} تومان
                        </p>
                    )}
                </div>

                <nav className="flex-grow space-y-3">
                    {links.map((link, index) => (
                        <NavLink
                            key={index}
                            to={link.to}
                            className={({ isActive }) =>
                                `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`
                            }
                        >
                            {link.text}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto text-center">
                    <Button
                        variant="default"
                        className="w-full mb-4 bg-primary hover:bg-primary/90"
                        onClick={handleLogout}
                    >
                        خروج از حساب کاربری
                    </Button>
                    <div className="text-sm">
                        <p>ehsanfood.com</p>
                        <p>22887686</p>
                    </div>
                </div>
            </aside>

            <main className="flex-grow p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};