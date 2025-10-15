// src/pages/admin/user/AddEditUserPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from '@/services/userService';
import { getCompanies } from '@/services/companyService';
import { useAuth } from '@/hooks/useAuth';
import { Company, User } from '@/types';
import { getCurrentUser } from '@/services/userService';

const AddEditUserPage = () => {
    const navigate = useNavigate();
    const { isCompanyAdmin, isSuperAdmin } = useAuth();
    
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Form State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyId, setCompanyId] = useState<string>('');
    const [role, setRole] = useState<'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE'>('EMPLOYEE');

    useEffect(() => {
        if (isSuperAdmin) {
            getCompanies().then(setAllCompanies);
        }
        if (isCompanyAdmin) {
            getCurrentUser().then(user => {
                setCurrentUser(user);
                setCompanyId(String(user.company));
            });
        }
    }, [isSuperAdmin, isCompanyAdmin]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser({
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                company: parseInt(companyId),
                role,
            });
            navigate('/admin/users');
        } catch (error) {
            console.error("Failed to create user:", error);
            alert('خطا در ثبت کاربر جدید.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PageHeader title="افزودن کاربر جدید" />
            <Card>
                <CardHeader>
                    <CardTitle>اطلاعات کاربر</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">نام</Label>
                            <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">نام خانوادگی</Label>
                            <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="username">نام کاربری</Label>
                            <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="password">رمز عبور</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">شرکت</Label>
                             <Select 
                                onValueChange={setCompanyId} 
                                value={companyId}
                                disabled={isCompanyAdmin}
                                required
                            >
                                <SelectTrigger><SelectValue placeholder="انتخاب شرکت" /></SelectTrigger>
                                <SelectContent>
                                    {isSuperAdmin && allCompanies.map(c => (
                                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                    ))}
                                    {isCompanyAdmin && currentUser && (
                                        <SelectItem value={String(currentUser.company)}>{currentUser.company_name}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="role">سطح دسترسی</Label>
                             <Select 
                                onValueChange={(value) => setRole(value as any)} 
                                defaultValue="EMPLOYEE" 
                                disabled={isCompanyAdmin}
                                required
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {isSuperAdmin && (
                                        <>
                                            <SelectItem value="SUPER_ADMIN">ادمین کل</SelectItem>
                                            <SelectItem value="COMPANY_ADMIN">ادمین شرکت</SelectItem>
                                        </>
                                    )}
                                    <SelectItem value="EMPLOYEE">کارمند</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="flex justify-end pt-4">
                        <Button type="submit">ثبت اطلاعات</Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default AddEditUserPage;