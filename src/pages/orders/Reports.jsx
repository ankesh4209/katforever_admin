import React from 'react';
import {
    BarChart3,
    TrendingUp,
    IndianRupee,
    ShoppingBag,
    Users,
    Download,
    CalendarDays,
    FileText
} from 'lucide-react';

const Reports = () => {
    const stats = [
        {
            title: 'Total Revenue',
            value: '₹4,85,240',
            icon: IndianRupee,
            color: 'from-emerald-500 to-green-600'
        },
        {
            title: 'Total Orders',
            value: '1,248',
            icon: ShoppingBag,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Customers',
            value: '842',
            icon: Users,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Growth Rate',
            value: '18.6%',
            icon: TrendingUp,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    const reports = [
        {
            title: 'Sales Report',
            description: 'Monthly sales performance and revenue summary.',
            date: '18 May 2026',
            type: 'PDF'
        },
        {
            title: 'Order Report',
            description: 'Detailed overview of placed, shipped and delivered orders.',
            date: '17 May 2026',
            type: 'Excel'
        },
        {
            title: 'Customer Report',
            description: 'Customer activity, repeat buyers and account growth.',
            date: '16 May 2026',
            type: 'PDF'
        },
        {
            title: 'Inventory Report',
            description: 'Stock movement, low-stock items and product performance.',
            date: '15 May 2026',
            type: 'Excel'
        }
    ];

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Reports
                    </h1>
                    <p className="text-gray-500 mt-1">
                        View business performance, sales insights and downloadable reports.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition">
                    <Download className="w-4 h-4" />
                    Export All
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className={`rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-white/80">
                                        {item.title}
                                    </p>
                                    <h2 className="text-3xl font-bold mt-2">
                                        {item.value}
                                    </h2>
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <Icon className="w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Sales Overview
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Monthly revenue and order analytics.
                            </p>
                        </div>

                        <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>

                    <div className="p-6">
                        <div className="h-72 flex items-end gap-4">
                            {[
                                { month: 'Jan', value: 45 },
                                { month: 'Feb', value: 60 },
                                { month: 'Mar', value: 50 },
                                { month: 'Apr', value: 72 },
                                { month: 'May', value: 84 },
                                { month: 'Jun', value: 68 },
                                { month: 'Jul', value: 90 }
                            ].map((item) => (
                                <div
                                    key={item.month}
                                    className="flex-1 flex flex-col items-center gap-3"
                                >
                                    <div className="w-full h-56 flex items-end rounded-xl bg-purple-50 overflow-hidden">
                                        <div
                                            className="w-full rounded-t-xl bg-gradient-to-t from-purple-600 to-pink-400"
                                            style={{ height: `${item.value}%` }}
                                        />
                                    </div>

                                    <span className="text-xs font-semibold text-gray-500">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                        <h2 className="text-xl font-bold text-gray-800">
                            Quick Summary
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Current month performance.
                        </p>
                    </div>

                    <div className="p-5 space-y-4">
                        {[
                            ['Revenue Target', '78%'],
                            ['Order Completion', '91%'],
                            ['Return Rate', '4.8%'],
                            ['Customer Growth', '22%']
                        ].map(([label, value]) => (
                            <div key={label}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {label}
                                    </span>
                                    <span className="text-sm font-bold text-purple-700">
                                        {value}
                                    </span>
                                </div>

                                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-purple-600"
                                        style={{ width: value }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Recent Reports
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Download generated business reports.
                        </p>
                    </div>

                    <button className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition">
                        <CalendarDays className="w-4 h-4" />
                        This Month
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {reports.map((report) => (
                        <div
                            key={report.title}
                            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 hover:bg-purple-50/40 transition"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-purple-700" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        {report.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {report.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Generated on {report.date}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                                    {report.type}
                                </span>

                                <button className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition">
                                    <Download className="w-4 h-4" />
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reports;