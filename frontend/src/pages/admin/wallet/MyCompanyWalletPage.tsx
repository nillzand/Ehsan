// frontend/src/pages/admin/wallet/MyCompanyWalletPage.tsx
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMyCompanyWallet } from '@/services/walletService';
import { Wallet } from '@/types';
import { Badge } from '@/components/ui/badge';

const MyCompanyWalletPage = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        getMyCompanyWallet()
            .then(setWallet)
            .catch(() => setError('خطا در دریافت اطلاعات کیف پول.'))
            .finally(() => setIsLoading(false));
    }, []);

    const getTransactionTypeLabel = (type: string) => {
        switch (type) {
            case 'DEPOSIT': return 'واریز';
            case 'BUDGET_ALLOCATION': return 'تخصیص اعتبار';
            case 'ORDER_DEDUCTION': return 'ثبت سفارش';
            case 'REFUND': return 'بازگشت وجه';
            default: return type;
        }
    };

    if (isLoading) return <p>در حال بارگذاری اطلاعات...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!wallet) return <p>اطلاعات کیف پول یافت نشد.</p>;

    return (
        <div>
            <PageHeader title={`کیف پول شرکت: ${wallet.company_name}`} />

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>موجودی فعلی</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{Number(wallet.balance).toLocaleString('fa-IR')} تومان</p>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold mb-4">تاریخچه تراکنش‌ها</h2>
            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>تاریخ</TableHead>
                            <TableHead>نوع تراکنش</TableHead>
                            <TableHead>مبلغ (تومان)</TableHead>
                            <TableHead>توضیحات</TableHead>
                            <TableHead>کاربر مرتبط</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {wallet.transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell>{new Date(tx.timestamp).toLocaleString('fa-IR')}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{getTransactionTypeLabel(tx.transaction_type)}</Badge>
                                </TableCell>
                                <TableCell className={Number(tx.amount) < 0 ? 'text-red-600' : 'text-green-600'}>
                                    {Number(tx.amount).toLocaleString('fa-IR')}
                                </TableCell>
                                <TableCell>{tx.description}</TableCell>
                                <TableCell>{tx.user_username}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default MyCompanyWalletPage;