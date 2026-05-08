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
      subtitle: "Lifetime Revenue",
      change: "",
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
      change: "",
      changeType: "positive",
    },
    {
      title: "Low Stock Alerts",
      value: (
        (dashboardData?.outOfStockProducts || 0) +
        (dashboardData?.lowStockProducts || 0)
      ).toLocaleString(),
      icon: AlertTriangle,
      subtitle: `${dashboardData?.lowStockProducts || 0} Low Stock`,
      change: `${dashboardData?.outOfStockProducts || 0} Out`,
      changeType: dashboardData?.outOfStockProducts > 0 ? "negative" : "positive",
    },
    {
      title: "New Customers",
      value: dashboardData?.newUsers?.toLocaleString() || "0",
      icon: UserPlus,
      subtitle: "Last 30 days",
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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2 mt-2">
            <Clock className="h-4 w-4" />
            Last updated: Just now
          </p>
        </div>

        <select className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
          <option>Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === "positive";

          return (
            <Card
              key={stat.title}
              className="border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="p-3 rounded-xl bg-slate-100">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${
                      isPositive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {stat.change || "Live"}
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {stat.value}
                </h3>

                <p className="text-xs text-slate-500 mt-3">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Activity className="h-5 w-5 text-blue-600" />
                Revenue Analytics
              </CardTitle>
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                Last 30 days
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-300">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                  <TrendingUp className="h-7 w-7 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Chart coming soon
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Visualize your revenue trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Sales Overview
              </CardTitle>
              <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
                This month
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-300">
              <div className="text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                  <Package className="h-7 w-7 text-blue-600" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Chart coming soon
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Track your sales performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                Recent Orders
              </CardTitle>
              <Badge className="bg-blue-600 text-white">
                {recentOrders.length} orders
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.originalId || order.id}
                  onClick={() => navigate(`/orders/${order.originalId}`)}
                  className="group p-4 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">
                          #{order.id}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-md border font-medium ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700">{order.customer}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {order.time}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        ₹{order.amount?.toLocaleString()}
                      </p>

                      <button className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-3 w-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recentOrders.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">
                  No recent orders found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Star className="h-5 w-5 text-blue-600" />
                Top Products
              </CardTitle>
              <Badge className="bg-blue-600 text-white">
                {topProducts.length} items
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">
                        {product.name}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-slate-500">
                          {product.sales} sales
                        </p>
                        <span className="text-slate-300">•</span>
                        <p className="text-sm font-semibold text-slate-800">
                          {product.revenue}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs text-slate-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-lg ${
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
                <p className="text-sm text-slate-500 text-center py-6">
                  No top products found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-200 bg-slate-50">
          <CardTitle className="text-slate-900">Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
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
                  className="group p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-200 transition-all text-left"
                >
                  <div className="w-11 h-11 rounded-lg bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-all">
                    <ActionIcon className="h-5 w-5 text-slate-700 group-hover:text-white" />
                  </div>

                  <p className="text-sm font-semibold text-slate-900">
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