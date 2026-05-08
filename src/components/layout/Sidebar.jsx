import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  RefreshCw,
  Truck,
  Image,
  Tag,
  BarChart3,
  Settings,
  Store,
  X,
  Activity,
} from "lucide-react";

export default function Sidebar({ onClose }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/products", icon: Package },
    { name: "Categories", path: "/categories", icon: FolderTree },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Users", path: "/users", icon: Users },
    { name: "Returns", path: "/returns", icon: RefreshCw },
    { name: "Shipping", path: "/shipping", icon: Truck },
    { name: "Banners", path: "/banners", icon: Image },
    { name: "Offers", path: "/offers", icon: Tag },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800 shadow-xl">
      <div className="flex items-center justify-between px-6 py-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-sm">
            <Store className="h-6 w-6 text-sky-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              katforever
            </h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>

        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5 h-[calc(100vh-190px)] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                active
                  ? "bg-slate-800 border border-slate-700 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-sky-500" />
              )}

              <div
                className={cn(
                  "relative z-10 p-2 rounded-lg transition-all duration-200",
                  active
                    ? "bg-sky-500 text-white"
                    : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={cn(
                  "relative z-10 text-sm transition-all duration-200",
                  active
                    ? "text-white font-semibold"
                    : "text-slate-400 font-medium group-hover:text-white"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-950">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">System Status</p>
              <p className="text-xs text-slate-400">All systems operational</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full w-[86%] rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>
    </aside>
  );
}