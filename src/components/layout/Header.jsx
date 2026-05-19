import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  ShoppingBag,
  Package,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default function Header({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(() => searchParams.get('search') || '');

  const notifications = [
    { id: 1, type: "order", title: "New Order #1234", message: "Order placed", read: false },
    { id: 2, type: "product", title: "Low Stock Alert", message: "Only 5 left", read: false },
    { id: 3, type: "success", title: "Product Updated", message: "Updated successfully", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type) => {
    const icons = {
      order: <ShoppingBag className="h-4 w-4 text-blue-600" />,
      product: <Package className="h-4 w-4 text-orange-500" />,
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      info: <TrendingUp className="h-4 w-4 text-gray-500" />,
    };
    return icons[type] || null;
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchText.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Menu */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-slate-100 rounded-lg"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 text-slate-700" />
        </Button>

        {/* Search */}
        <div className="flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 h-10 bg-slate-100 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-lg hover:bg-slate-100"
              >
                <Bell className="h-5 w-5 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center rounded-full bg-red-500 text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 rounded-lg">
              <DropdownMenuLabel className="font-semibold">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex gap-3 p-3">
                  {getNotificationIcon(n.type)}
                  <div>
                    <p className="text-sm font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.message}</p>
                  </div>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-blue-600 font-medium">
                View all
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 px-3 h-10 bg-transparent hover:bg-slate-100 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-800 text-white text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden md:block text-sm font-medium text-slate-800">
                  {user?.name || "Admin"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-lg">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}