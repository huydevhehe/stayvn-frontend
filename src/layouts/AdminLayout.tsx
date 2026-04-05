import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  Hotel, 
  Bed, 
  Settings, 
  Bath,
  Calendar, 
  CreditCard, 
  Star, 
  DollarSign,
  LogOut,
  LayoutDashboard,
  Bell,
  Search,
  User,
  ChevronDown,
  Menu,
  Home,
  FileText,
  Tag
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SidebarItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
      active 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
        : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
    <span className="font-medium tracking-tight whitespace-nowrap">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />}
  </Link>
);

const AdminLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: "/admin", icon: LayoutDashboard, label: "Bảng điều khiển" },
    { to: "/admin/hotels", icon: Hotel, label: "Khách sạn" },
    { to: "/admin/room-types", icon: Bed, label: "Loại phòng" },
    { to: "/admin/rooms", icon: Settings, label: "Phòng" },
    { to: "/admin/amenities", icon: Bath, label: "Tiện ích" },
    { to: "/admin/bookings", icon: Calendar, label: "Đặt phòng" },
    { to: "/admin/payments", icon: CreditCard, label: "Thanh toán" },
    { to: "/admin/reviews", icon: Star, label: "Đánh giá" },
    { to: "/admin/room-prices", icon: DollarSign, label: "Giá phòng" },
    { to: "/admin/monthly-rentals", icon: Home, label: "Quản lý trọ tháng" },
    { to: "/admin/monthly-bookings", icon: FileText, label: "Đơn thuê trọ" },
    { to: "/admin/users", icon: User, label: "Khách hàng" },
    { to: "/admin/resales", icon: Tag, label: "Nhượng phòng" },
  ];

  const currentPage = navItems.find(item => 
    item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to)
  )?.label || "Bảng điều khiển";

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col p-6 bg-white border-r border-slate-200 shadow-sm z-50">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
            <Hotel className="text-primary-foreground w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Quản trị StayVN</h1>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 font-semibold">Hệ thống quản lý</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1.5">
          <p className="px-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Danh mục chính</p>
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
           <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <p className="text-xs font-semibold text-slate-900 mb-1">Cần trợ giúp?</p>
              <p className="text-[11px] text-slate-500 mb-3">Kiểm tra tài liệu hoặc liên hệ hỗ trợ.</p>
              <button className="w-full py-2 px-3 bg-white border border-slate-200 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Xem tài liệu
              </button>
           </div>
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-300 group"
          >
            <div className="p-2 rounded-lg bg-destructive/5 group-hover:bg-destructive/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-semibold tracking-tight">Đăng xuất</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">{currentPage}</h2>
              <div className="flex items-center text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                <span>Quản trị</span>
                <span className="mx-2">/</span>
                <span className="text-primary">{currentPage}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Search - Desktop only */}
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-all active:scale-95">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
              </button>

              <div className="w-[1px] h-8 bg-slate-200 mx-1 hidden sm:block" />

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 transition-all outline-none">
                  <Avatar className="w-9 h-9 border-2 border-primary/10 shadow-sm">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">AD</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left mr-1">
                    <p className="text-sm font-bold text-slate-900 leading-none mb-1">Quản trị viên</p>
                    <p className="text-[10px] font-semibold text-muted-foreground leading-none">Tổng quản trị</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-slate-100 shadow-xl mt-2">
                  <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Cài đặt tài khoản
                  </DropdownMenuLabel>
                  <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-primary/5">
                    <User className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-700">Hồ sơ của tôi</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-primary/5">
                    <Settings className="mr-3 h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-700">Cài đặt</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100 my-1" />
                  <DropdownMenuItem className="rounded-xl px-2 py-2 cursor-pointer focus:bg-destructive/5 text-destructive">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-bold">Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8FAFC] p-4 sm:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
