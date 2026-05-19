import React, { useState } from 'react';
import {
    User,
    Bell,
    Shield,
    Globe,
    Lock,
    CreditCard,
    Save,
    Store
} from 'lucide-react';

const Settings = () => {
    const [notifications, setNotifications] = useState(true);
    const [emailUpdates, setEmailUpdates] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);

    const settingsCards = [
        {
            title: 'Store Settings',
            description: 'Manage your store information and branding.',
            icon: Store,
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Security',
            description: 'Protect your account and customer data.',
            icon: Shield,
            color: 'from-emerald-500 to-green-600'
        },
        {
            title: 'Payments',
            description: 'Configure payment methods and billing.',
            icon: CreditCard,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Preferences',
            description: 'Customize language, timezone and notifications.',
            icon: Globe,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Settings
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage your account, store preferences and security settings.
                    </p>
                </div>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {settingsCards.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className={`rounded-2xl bg-gradient-to-br ${item.color} p-5 text-white shadow-lg`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-lg font-bold">
                                        {item.title}
                                    </p>

                                    <p className="text-sm text-white/80 mt-2 leading-relaxed">
                                        {item.description}
                                    </p>
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
                    <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                        <h2 className="text-xl font-bold text-gray-800">
                            Profile Settings
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Update your personal and store information.
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            <div className="w-24 h-24 rounded-3xl bg-purple-100 flex items-center justify-center">
                                <User className="w-10 h-10 text-purple-700" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Admin Profile
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Manage your profile photo and account details.
                                </p>

                                <button className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition">
                                    Change Photo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Ayodhya Gupta"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="admin@example.com"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Store Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="KatForever"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                    Contact Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="+91 9876543210"
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                Store Description
                            </label>

                            <textarea
                                rows="4"
                                placeholder="Write something about your store..."
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                            <h2 className="text-xl font-bold text-gray-800">
                                Notifications
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Manage alerts and updates.
                            </p>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <Bell className="w-5 h-5 text-purple-600 mt-1" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Push Notifications
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Receive order and activity alerts.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        setNotifications(!notifications)
                                    }
                                    className={`relative h-6 w-11 rounded-full transition ${
                                        notifications
                                            ? 'bg-purple-600'
                                            : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                            notifications
                                                ? 'left-6'
                                                : 'left-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <Globe className="w-5 h-5 text-purple-600 mt-1" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Email Updates
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Receive weekly report emails.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        setEmailUpdates(!emailUpdates)
                                    }
                                    className={`relative h-6 w-11 rounded-full transition ${
                                        emailUpdates
                                            ? 'bg-purple-600'
                                            : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                            emailUpdates
                                                ? 'left-6'
                                                : 'left-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
                            <h2 className="text-xl font-bold text-gray-800">
                                Security
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Account protection settings.
                            </p>
                        </div>

                        <div className="p-5 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-purple-600 mt-1" />

                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Two Factor Auth
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Extra layer of account security.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setTwoFactor(!twoFactor)}
                                    className={`relative h-6 w-11 rounded-full transition ${
                                        twoFactor
                                            ? 'bg-purple-600'
                                            : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                            twoFactor ? 'left-6' : 'left-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <button className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;