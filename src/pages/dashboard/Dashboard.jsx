import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminAPI } from "@/lib/adminAPI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Activity,
  AlertTriangle,
  UserPlus,
  Star,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: adminAPI.getDashboardStats,
    refetchInterval: 30000,
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      subtitle: "Lifetime revenue",
      color: "from-emerald-500 to-green-600",
      change: "Live",
      changeType: "positive",
    },
    {
      title: "Total Orders",
      value: dashboardData?.totalOrders?.toLocaleString() || "0",
      icon: ShoppingCart,
      subtitle: `Pending: ${
        dashboardData?.ordersByStatus?.find((o) => o._id === "Pending")
          ?.count || 0
      }`,
      color: "from-purple-500 to-purple-600",
      change: "Live",
      changeType: "positive",
    },
    {
      title: "Stock Alerts",
      value: (
        (dashboardData?.outOfStockProducts || 0) +
        (dashboardData?.lowStockProducts || 0)
      ).toLocaleString(),
      icon: AlertTriangle,
      subtitle: `${dashboardData?.lowStockProducts || 0} low stock`,
      color: "from-amber-500 to-orange-500",
      change: `${dashboardData?.outOfStockProducts || 0} out`,
      changeType:
        dashboardData?.outOfStockProducts > 0 ? "negative" : "positive",
    },
    {
      title: "New Customers",
      value: dashboardData?.newUsers?.toLocaleString() || "0",
      icon: UserPlus,
      subtitle: "Last 30 days",
      color: "from-blue-500 to-cyan-500",
      change: `Total: ${dashboardData?.totalUsers?.toLocaleString() || "0"}`,
      changeType: "positive",
    },
  ];

  const recentOrders =
    dashboardData?.recentOrders?.map((order) => ({
      id: order._id.substring(order._id.length - 6).toUpperCase(),
      originalId: order._id,
      customer: order.user?.name || "Unknown",
      amount: order.totalPrice,
      status: order.orderStatus,
      time: new Date(order.createdAt).toLocaleDateString(),
    })) || [];

  const topProducts =
    dashboardData?.topProducts?.map((product) => ({
      name: product.name,
      sales: product.sales,
      revenue: `₹${product.revenue.toLocaleString()}`,
      trend: product.trend,
      rating: product.rating || 4.5,
    })) || [];

  const getStatusBadge = (status) => {
    const badges = {
      Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Processing: "bg-amber-50 text-amber-700 border-amber-200",
      Shipped: "bg-blue-50 text-blue-700 border-blue-200",
      Pending: "bg-slate-100 text-slate-700 border-slate-200",
    };

    return badges[status] || badges.Pending;
  };

  return (
    <div className="min-h-screen space-y-6 pb-10">
      <div className="rounded-3xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 p-6 md:p-8 text-white shadow-xl overflow-hidden relative">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-14 right-20 h-44 w-44 rounded-full bg-white/10" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white">
              <Activity className="h-4 w-4" />
              Admin Dashboard
            </p>

            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Dashboard Overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm md:text-base text-white/80">
              Monitor sales, orders, customers and product performance from one
              clean dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold backdrop-blur">
              <Clock className="h-4 w-4" />
              Last updated: Just now
            </div>

            <select className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === "positive";

          return (
            <Card
              key={stat.title}
              className={`border-0 shadow-lg bg-gradient-to-br ${stat.color} text-white overflow-hidden`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white/80">
                      {stat.title}
                    </p>

                    <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>

                    <p className="text-xs text-white/75 mt-3">
                      {stat.subtitle}
                    </p>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-5 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  {isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {stat.change}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Activity className="h-5 w-5 text-purple-600" />
                Revenue Analytics
              </CardTitle>

              <Badge className="bg-white text-purple-700 border border-purple-200">
                Last 30 days
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-72 flex items-end gap-4">
              {[
                { month: "Jan", value: 45 },
                { month: "Feb", value: 62 },
                { month: "Mar", value: 52 },
                { month: "Apr", value: 74 },
                { month: "May", value: 86 },
                { month: "Jun", value: 68 },
                { month: "Jul", value: 92 },
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
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Sales Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-5">
            {[
              ["Revenue Target", "78%"],
              ["Order Completion", "91%"],
              ["Customer Growth", "64%"],
              ["Product Sales", "83%"],
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

            <div className="rounded-2xl bg-purple-50 border border-purple-100 p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                  <CalendarDays className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Monthly Performance
                  </h3>
                  <p className="text-3xl font-bold text-purple-700 mt-2">
                    82%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Better than previous month.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Recent Orders
              </CardTitle>

              <Badge className="bg-purple-600 text-white">
                {recentOrders.length} orders
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.originalId || order.id}
                  onClick={() => navigate(`/orders/${order.originalId}`)}
                  className="group p-4 rounded-2xl border border-gray-200 hover:bg-purple-50/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">#{order.id}</p>

                        <span
                          className={`px-2 py-1 text-xs rounded-full border font-semibold ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-700">
                        {order.customer}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {order.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{order.amount?.toLocaleString()}
                      </p>

                      <button className="text-xs text-purple-600 font-semibold inline-flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3 w-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No recent orders found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Star className="h-5 w-5 text-purple-600" />
                Top Products
              </CardTitle>

              <Badge className="bg-purple-600 text-white">
                {topProducts.length} items
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-5">
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="p-4 rounded-2xl border border-gray-200 hover:bg-purple-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{product.name}</p>

                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">
                          {product.sales} sales
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm font-semibold text-gray-800">
                          {product.revenue}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs text-gray-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-xl ${
                        product.trend === "up"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.trend === "up" ? (
                        <TrendingUp className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {topProducts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No top products found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Package, label: "Add Product", path: "/products/create" },
              { icon: ShoppingCart, label: "View Orders", path: "/orders" },
              { icon: Users, label: "Manage Users", path: "/users" },
              { icon: TrendingUp, label: "View Reports", path: "/reports" },
            ].map((action) => {
              const ActionIcon = action.icon;

              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="group p-5 rounded-2xl border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-200 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 group-hover:bg-purple-600 flex items-center justify-center mb-4 transition-all">
                    <ActionIcon className="h-5 w-5 text-purple-700 group-hover:text-white" />
                  </div>

                  <p className="text-sm font-bold text-gray-900">
                    {action.label}
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}