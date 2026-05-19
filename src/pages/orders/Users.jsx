import React from 'react';
import {
    Users as UsersIcon,
    UserCheck,
    UserPlus,
    ShieldCheck,
    Search,
    Mail,
    Phone,
    MoreHorizontal
} from 'lucide-react';

const Users = () => {
    const stats = [
        {
            title: 'Total Users',
            value: '12,480',
            icon: UsersIcon,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Active Users',
            value: '9,842',
            icon: UserCheck,
            color: 'from-emerald-500 to-green-600'
        },
        {
            title: 'New Signups',
            value: '248',
            icon: UserPlus,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Admin Members',
            value: '12',
            icon: ShieldCheck,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    const users = [
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+91 9876543210',
            role: 'Customer',
            status: 'Active',
            joined: '18 May 2026'
        },
        {
            name: 'Anjali Verma',
            email: 'anjali@example.com',
            phone: '+91 9123456780',
            role: 'Customer',
            status: 'Inactive',
            joined: '16 May 2026'
        },
        {
            name: 'Rahul Singh',
            email: 'rahul@example.com',
            phone: '+91 9988776655',
            role: 'Admin',
            status: 'Active',
            joined: '14 May 2026'
        },
        {
            name: 'Neha Gupta',
            email: 'neha@example.com',
            phone: '+91 9012345678',
            role: 'Customer',
            status: 'Pending',
            joined: '12 May 2026'
        }
    ];

    const getStatusClass = (status) => {
        const styles = {
            Active: 'bg-emerald-100 text-emerald-700',
            Inactive: 'bg-gray-100 text-gray-700',
            Pending: 'bg-amber-100 text-amber-700'
        };

        return styles[status] || 'bg-gray-100 text-gray-700';
    };

    const getRoleClass = (role) => {
        const styles = {
            Admin: 'bg-purple-100 text-purple-700',
            Customer: 'bg-blue-100 text-blue-700'
        };

        return styles[role] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Users Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage customers, admins and platform users.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition">
                    <UserPlus className="w-4 h-4" />
                    Add New User
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

            <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            All Users
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            List of registered users and account details.
                        </p>
                    </div>

                    <div className="relative w-full lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Contact
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Role
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-bold text-gray-700">
                                    Joined
                                </th>

                                <th className="px-5 py-4 text-right text-sm font-bold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.email}
                                    className="border-t border-gray-100 hover:bg-purple-50/40 transition"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                                                {user.name.charAt(0)}
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {user.name}
                                                </h3>

                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-purple-500" />
                                            {user.phone}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getRoleClass(
                                                user.role
                                            )}`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                                user.status
                                            )}`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600">
                                        {user.joined}
                                    </td>

                                    <td className="px-5 py-4 text-right">
                                        <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;