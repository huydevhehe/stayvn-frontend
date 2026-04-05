import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  User as UserIcon, 
  History, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut,
  LayoutDashboard,
  Home,
  Crown,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: "/profile", icon: UserIcon, label: "Hồ sơ cá nhân" },
  { to: "/profile/history", icon: History, label: "Lịch sử đặt phòng" },
  { to: "/profile/active", icon: Calendar, label: "Đơn đang đặt" },
  { to: "/profile/rentals", icon: Home, label: "Trọ của tôi" },
  { to: "/profile/favorites", icon: Heart, label: "Yêu thích" },
  { to: "/profile/settings", icon: Settings, label: "Cài đặt tài khoản" },
];

const UserSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (to: string) => location.pathname === to;

  return (
    <div className="w-full bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-xl shadow-primary/5 flex flex-col gap-8 h-fit sticky top-24">
      {/* Header Info */}
      <div className="flex flex-col items-center text-center gap-4 px-2">
        <div className="relative group">
          {/* VIP Glow Effect */}
          {user?.isLoyalty && (
            <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full animate-pulse" />
          )}
          
          <div className={cn(
            "w-20 h-20 rounded-3xl rotate-3 group-hover:rotate-6 transition-transform duration-500 shadow-lg",
            user?.isLoyalty ? "bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-amber-500/20" : "bg-gradient-to-br from-primary to-indigo-600 shadow-primary/20"
          )} />
          
          <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center absolute inset-0 -rotate-3 group-hover:rotate-0 transition-transform duration-500 border border-slate-100 shadow-inner overflow-hidden">
             {user?.avatarUrl ? (
               <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
             ) : (
               <span className={cn(
                 "text-2xl font-black bg-clip-text text-transparent transform transition-transform group-hover:scale-110",
                 user?.isLoyalty ? "bg-gradient-to-br from-amber-500 to-yellow-600" : "bg-gradient-to-br from-primary to-indigo-600"
               )}>
                 {user?.name?.charAt(0) || "U"}
               </span>
             )}
             
             {user?.isLoyalty && (
               <div className="absolute top-0 right-0 p-1 bg-amber-500 rounded-bl-xl shadow-sm">
                 <Crown className="w-3 h-3 text-white fill-white" />
               </div>
             )}
          </div>
        </div>
        <div className="flex flex-col min-w-0 items-center">
          <p className="font-black text-slate-800 text-lg tracking-tight truncate leading-tight">{user?.name || "Người dùng"}</p>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase items-center justify-center flex gap-1 mb-1">
             {user?.email}
          </p>
          
          {user?.isLoyalty && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-lg shadow-amber-500/20 animate-in fade-in zoom-in duration-500">
               <Crown className="w-3 h-3 text-white fill-white" />
               <span className="text-[9px] font-black text-white tracking-[0.1em] uppercase">StayVN Elite</span>
               <Sparkles className="w-3 h-3 text-amber-200 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                active 
                ? "bg-primary text-white shadow-lg shadow-primary/25 font-semibold -translate-y-0.5" 
                : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-900"}`} />
              <span className="text-sm tracking-tight">{item.label}</span>
            </Link>
          );
        })}
        
        {user?.role === "ROLE_ADMIN" && (
          <>
            <div className="h-px bg-slate-100 my-2 mx-4" />
            <Link
              to="/admin"
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-primary font-bold hover:bg-primary/5 shadow-sm border border-primary/10"
            >
              <LayoutDashboard className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm tracking-tight">Quản trị hệ thống</span>
            </Link>
          </>
        )}
      </nav>

      <div className="pt-4 px-2 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-rose-500 hover:text-rose-600 transition-all font-semibold w-full px-4 py-3 rounded-2xl hover:bg-rose-50/50 group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
