import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/adminAPI';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    Eye,
    ShoppingBag,
    Clock3,
    Truck,
    CheckCircle2
} from 'lucide-react';

export default function Orders() {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useQuery({
        queryKey: ['adminOrders', page],
        queryFn: () => adminAPI.getAllOrders({ page, limit: 10 }),
        keepPreviousData: true
    });

    const getStatusBadge = (status) => {
        const badges = {
            Delivered:
                'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
            Processing:
                'bg-amber-100 text-amber-700 hover:bg-amber-200',
            Shipped:
                'bg-blue-100 text-blue-700 hover:bg-blue-200',
            Pending:
                'bg-gray-100 text-gray-700 hover:bg-gray-200',
            Cancelled:
                'bg-red-100 text-red-700 hover:bg-red-200'
        };

        return badges[status] || badges.Pending;
    };

    const totalOrders = data?.totalOrders || 0;

    const pendingOrders =
        data?.orders?.filter((o) => o.orderStatus === 'Pending').length || 0;

    const shippedOrders =
        data?.orders?.filter((o) => o.orderStatus === 'Shipped').length || 0;

    const deliveredOrders =
        data?.orders?.filter((o) => o.orderStatus === 'Delivered').length || 0;

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Orders Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage and track all customer orders
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-100">
                                Total Orders
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {totalOrders}
                            </h2>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <ShoppingBag className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-100">
                                Pending Orders
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {pendingOrders}
                            </h2>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Clock3 className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-100">
                                Shipped Orders
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {shippedOrders}
                            </h2>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Truck className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white overflow-hidden">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-100">
                                Delivered
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {deliveredOrders}
                            </h2>
                        </div>

                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border border-gray-200 shadow-xl overflow-hidden rounded-2xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                    <CardTitle className="text-gray-800 text-xl">
                        All Orders
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="text-center py-16 font-semibold text-gray-500 animate-pulse">
                            Loading orders...
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50">
                                            <TableHead className="font-bold text-gray-700">
                                                Order ID
                                            </TableHead>

                                            <TableHead className="font-bold text-gray-700">
                                                Date
                                            </TableHead>

                                            <TableHead className="font-bold text-gray-700">
                                                Customer
                                            </TableHead>

                                            <TableHead className="font-bold text-gray-700">
                                                Total
                                            </TableHead>

                                            <TableHead className="font-bold text-gray-700">
                                                Payment
                                            </TableHead>

                                            <TableHead className="font-bold text-gray-700">
                                                Status
                                            </TableHead>

                                            <TableHead className="text-right font-bold text-gray-700">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {data?.orders?.map((order) => (
                                            <TableRow
                                                key={order._id}
                                                className="hover:bg-purple-50/40 transition-colors"
                                            >
                                                <TableCell className="font-semibold text-purple-700">
                                                    {order._id
                                                        .substring(
                                                            order._id.length - 8
                                                        )
                                                        .toUpperCase()}
                                                </TableCell>

                                                <TableCell className="text-gray-600 font-medium">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString()}
                                                </TableCell>

                                                <TableCell className="font-semibold text-gray-800">
                                                    {order.shippingAddress
                                                        ?.name ||
                                                        order.user?.name ||
                                                        'Unknown'}
                                                </TableCell>

                                                <TableCell className="font-black text-gray-900">
                                                    ₹
                                                    {order.totalPrice.toLocaleString()}
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            order.paymentStatus ===
                                                            'Paid'
                                                                ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                                : 'border-amber-200 text-amber-700 bg-amber-50'
                                                        }
                                                    >
                                                        {order.paymentMethod} -{' '}
                                                        {
                                                            order.paymentStatus
                                                        }
                                                    </Badge>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        className={getStatusBadge(
                                                            order.orderStatus
                                                        )}
                                                    >
                                                        {order.orderStatus}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <Link
                                                        to={`/orders/${order._id}`}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="hover:bg-purple-100 hover:text-purple-700 border border-transparent hover:border-purple-200"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {data?.orders?.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={7}
                                                    className="text-center py-16 text-gray-500 font-semibold text-lg"
                                                >
                                                    No orders found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {data?.pages > 1 && (
                                <div className="flex justify-center flex-wrap gap-2 p-6 border-t border-gray-100 bg-white">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                        className="rounded-xl"
                                    >
                                        Previous
                                    </Button>

                                    {[...Array(data?.pages)].map((_, i) => (
                                        <Button
                                            key={i}
                                            variant={
                                                page === i + 1
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className={
                                                page === i + 1
                                                    ? 'bg-purple-600 hover:bg-purple-700 rounded-xl'
                                                    : 'rounded-xl'
                                            }
                                            onClick={() => setPage(i + 1)}
                                        >
                                            {i + 1}
                                        </Button>
                                    ))}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === data?.pages}
                                        onClick={() => setPage(page + 1)}
                                        className="rounded-xl"
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}