import { useState } from "react";
import { Menu, X, Globe, User, LogOut, Settings, Heart, History, LayoutDashboard, Crown, Tag } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    // Lấy user và isAuthenticated từ AuthContext
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Hàm bổ trợ lấy tên từ Email (Ví dụ: "quang@gmail.com" -> "quang")
    const getUserName = (email: string | undefined) => {
        if (!email) return "Người dùng";
        return email.split('@')[0];
    };

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="section-padding">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">StayVN</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/search" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Khách sạn</Link>
                        <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Trọ thuê tháng</a>
                        <Link to="/resale" className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1.5 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                            <Tag className="w-3.5 h-3.5 rotate-12" /> Săn Deal 30%
                        </Link>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            VI
                        </Button>

                        {isAuthenticated ? (
                            /* Đã đăng nhập: Hiển thị Avatar Dropdown dựa trên Email */
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all group relative">
                                        <div className="relative">
                                            <Avatar className={cn(
                                                "h-9 w-9 border transition-all duration-300", 
                                                user?.isLoyalty 
                                                    ? "border-amber-400 ring-4 ring-amber-400/10 shadow-lg shadow-amber-500/20 scale-105" 
                                                    : "border-border hover:border-primary"
                                            )}>
                                                <AvatarImage src="" alt={user?.email} />
                                                <AvatarFallback className={cn(
                                                    "font-bold uppercase",
                                                    user?.isLoyalty ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"
                                                )}>
                                                    {user?.email?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            
                                            {user?.isLoyalty && (
                                                <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full p-0.5 border-2 border-white shadow-xl animate-in zoom-in duration-500">
                                                    <Crown className="w-2.5 h-2.5 text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-bold leading-none flex items-center gap-2">
                                                {getUserName(user?.email)}
                                                {user?.isLoyalty && (
                                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-amber-200">
                                                        <Crown className="w-2.5 h-2.5 fill-amber-700" /> VIP
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {user?.role === "ROLE_ADMIN" && (
                                        <>
                                            <DropdownMenuItem 
                                                className="cursor-pointer gap-2 font-semibold text-primary focus:text-primary focus:bg-primary/5"
                                                onClick={() => navigate("/admin")}
                                            >
                                                <LayoutDashboard className="w-4 h-4" /> 
                                                Quản lý trang Web
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}
                                    <DropdownMenuItem 
                                        className="cursor-pointer gap-2"
                                        onClick={() => navigate("/profile")}
                                    >
                                        <User className="w-4 h-4" /> 
                                        Hồ sơ cá nhân
                                    </DropdownMenuItem>

                                    <DropdownMenuItem 
                                        className="cursor-pointer gap-2"
                                        onClick={() => navigate("/profile/history")}
                                    >
                                        <History className="w-4 h-4" /> 
                                        Lịch sử đặt phòng
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem 
                                        className="cursor-pointer gap-2 text-purple-600 font-bold focus:text-purple-700 focus:bg-purple-50"
                                        onClick={() => navigate("/resale")}
                                    >
                                        <Tag className="w-4 h-4" /> 
                                        Chợ Nhượng Phòng
                                    </DropdownMenuItem>

                                    <DropdownMenuItem 
                                        className="cursor-pointer gap-2"
                                        onClick={() => navigate("/profile/favorites")}
                                    >
                                        <Heart className="w-4 h-4" /> 
                                        Yêu thích
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer gap-2 border-t mt-1 pt-1 text-destructive focus:text-destructive focus:bg-destructive/5" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            /* Chưa đăng nhập: Hiển thị nút Login/Register */
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                                    Đăng nhập
                                </Button>
                                <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90" onClick={() => navigate("/register")}>
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col gap-3">
                            <Link to="/search" className="text-sm font-medium py-2">Khách sạn</Link>
                            <a href="#" className="text-sm font-medium py-2">Trọ thuê tháng</a>
                            <Link to="/resale" className="text-sm font-bold py-2 text-purple-600 flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Săn Deal Nhượng Phòng (-30%)
                            </Link>
                            <hr className="border-border my-1" />
                            {isAuthenticated ? (
                                <div className="space-y-3 px-2">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-primary">{getUserName(user?.email)}</span>
                                            {user?.isLoyalty && (
                                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border border-amber-200 flex items-center gap-1">
                                                    <Crown className="w-2.5 h-2.5 fill-amber-700" /> VIP
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                                    </div>
                                    {user?.role === "ROLE_ADMIN" && (
                                        <Button 
                                            variant="default" 
                                            className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none font-bold" 
                                            onClick={() => navigate("/admin")}
                                        >
                                            <LayoutDashboard className="w-4 h-4" /> Quản lý trang Web
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </Button>
                                </div>
                            ) : (
                                <Button size="sm" className="w-full rounded-full bg-primary" onClick={() => navigate("/login")}>
                                    Đăng nhập
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;