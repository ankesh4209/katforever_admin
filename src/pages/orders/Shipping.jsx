import React from 'react';
import {
    Truck,
    PackageCheck,
    Clock3,
    MapPinned,
    Search,
    CircleCheckBig,
    CircleDashed,
    CircleX
} from 'lucide-react';

const Shipping = () => {
    const stats = [
        {
            title: 'Total Shipments',
            value: '1,842',
            icon: Truck,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'In Transit',
            value: '248',
            icon: CircleDashed,
            color: 'from-amber-500 to-orange-500'
        },
        {
            title: 'Delivered',
            value: '1,420',
            icon: CircleCheckBig,
            color: 'from-emerald-500 to-green-600'
        },
        {
            title: 'Delayed',
            value: '36',
            icon: CircleX,
            color: 'from-red-500 to-rose-500'
        }
    ];

    const shipments = [
        {
            tracking: 'TRK-458721',
            customer: 'Priya Sharma',
            location: 'Bhopal, India',
            courier: 'Blue Dart',
            date: '18 May 2026',
            status: 'In Transit'
        },
        {
            tracking: 'TRK-458722',
            customer: 'Anjali Verma',
            location: 'Delhi, India',
            courier: 'Delhivery',
            date: '17 May 2026',
            status: 'Delivered'
        },
        {
            tracking: 'TRK-458723',
            customer: 'Neha Gupta',
            location: 'Mumbai, India',
            courier: 'XpressBees',
            date: '16 May 2026',
            status: 'Delayed'
        },
        {
            tracking: 'TRK-458724',
            customer: 'Ritika Jain',
            location: 'Indore, India',
            courier: 'DTDC',
            date: '15 May 2026',
            status: 'Pending'
        }
    ];

    const getStatusClass = (status) => {
        const styles = {
            Delivered: 'bg-emerald-100 text-emerald-700',
            'In Transit': 'bg-blue-100 text-blue-700',
            Pending: 'bg-amber-100 text-amber-700',
            Delayed: 'bg-red-100 text-red-700'
        };

        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Shipping Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track shipments, delivery progress and courier updates.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition">
                    <PackageCheck className="w-4 h-4" />
                    Create Shipment
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
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Shipment Tracking
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Monitor all active and completed shipments.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                            <input
                                type="text"
                                placeholder="Search tracking ID..."
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Tracking ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Location
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Courier
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {shipments.map((item) => (
                                    <tr
                                        key={item.tracking}
                                        className="border-t border-gray-100 hover:bg-purple-50/40 transition"
                                    >
                                        <td className="px-5 py-4 text-sm font-semibold text-purple-700">
                                            {item.tracking}
                                        </td>

                                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                            {item.customer}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <MapPinned className="w-4 h-4 text-purple-500" />
                                                {item.location}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-700">
                                            {item.courier}
                                        </td>

                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {item.date}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                        <h2 className="text-xl font-bold text-gray-800">
                            Delivery Progress
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Overall shipping performance summary.
                        </p>
                    </div>

                    <div className="p-5 space-y-5">
                        {[
                            ['Delivered Orders', '82%'],
                            ['Transit Progress', '64%'],
                            ['Pending Dispatch', '38%'],
                            ['Customer Satisfaction', '91%']
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

                        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5 mt-6">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                                    <Clock3 className="w-6 h-6" />
                                </div>

                                <div>
                                    <h3 className="font-bold text-gray-900">
                                        Average Delivery Time
                                    </h3>

                                    <p className="text-3xl font-bold text-purple-700 mt-2">
                                        2.4 Days
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Faster than last month performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shipping;