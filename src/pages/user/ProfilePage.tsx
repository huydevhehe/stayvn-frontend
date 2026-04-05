import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Phone as PhoneIcon, User as UserIcon, Lock, CheckCircle2, Loader2, X, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import userService from "@/api/userService";
import { motion } from "framer-motion";
import { Crown, Zap, Gift, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [banks, setBanks] = useState<any[]>([]);
    const [fetchingBanks, setFetchingBanks] = useState(false);
    
    // Password form state
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    
    // Password visibility state
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bankName: user?.bankName || "",
        bankAccountNumber: user?.bankAccountNumber || "",
        bankAccountName: user?.bankAccountName || "",
        bankCode: user?.bankCode || "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const memberSince = user?.createdAt 
        ? new Date(user.createdAt).toLocaleDateString("vi-VN", { month: 'long', year: 'numeric' })
        : "Tháng 1, 2024";

    React.useEffect(() => {
        const fetchBanks = async () => {
            setFetchingBanks(true);
            try {
                const res = await fetch("https://api.vietqr.io/v2/banks");
                const data = await res.json();
                if (data.code === "00") {
                    setBanks(data.data);
                }
            } catch (error) {
                console.error("Fetch banks error:", error);
            } finally {
                setFetchingBanks(false);
            }
        };
        fetchBanks();
    }, []);

    // Sync formData when user data is available or changes
    React.useEffect(() => {
        if (user && !isEditing) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                bankName: user.bankName || "",
                bankAccountNumber: user.bankAccountNumber || "",
                bankAccountName: user.bankAccountName || "",
                bankCode: user.bankCode || "",
            });
        }
    }, [user, isEditing]);

    const handleUpdate = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const updatedUser = await userService.updateProfile(user.id, formData);
            setUser(updatedUser);
            setIsEditing(false);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error: any) {
            console.error("Profile update error details:", error.response?.data || error.message);
            toast.error("Có lỗi xảy ra khi cập nhật hồ sơ.");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user?.id) return;

        // Simple validation
        if (!file.type.startsWith('image/')) {
            toast.error("Vui lòng chọn tệp hình ảnh.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error("Hình ảnh quá lớn. Vui lòng chọn tệp dưới 5MB.");
            return;
        }

        setUploading(true);
        try {
            const updatedUser = await userService.updateAvatar(user.id, file);
            setUser(updatedUser);
            toast.success("Cập nhật ảnh đại diện thành công!");
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast.error("Không thể tải lên ảnh đại diện.");
        } finally {
            setUploading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp.");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }

        setPasswordLoading(true);
        try {
            await userService.changePassword(user.id, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Đổi mật khẩu thành công!");
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error("Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.");
        } finally {
            setPasswordLoading(false);
        }
    };

    const LoyaltyCard = () => (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-[2rem] p-8 aspect-[1.6/1] flex flex-col justify-between text-white shadow-2xl group"
            style={{ 
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #C026D3 100%)",
            }}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tighter uppercase italic">StayVN <span className="text-amber-300">Elite</span></h3>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Digital Membership Card</p>
                </div>
                <Crown className="w-10 h-10 text-amber-300 fill-amber-300 shadow-amber-500/50" />
            </div>

            <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                   <p className="text-white/40 text-[9px] uppercase font-bold tracking-widest">Card Holder</p>
                   <p className="text-lg font-black tracking-tight">{user?.name?.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        </div>
                        <span className="text-[11px] font-bold">MIỄN CỌC 100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                            <Award className="w-4 h-4 text-amber-300" />
                        </div>
                        <span className="text-[11px] font-bold">XÁC NHẬN TỨC THÌ</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />

            {/* Hero Header Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] -mr-48 -mt-48 rounded-full" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -ml-32 -mb-32 rounded-full" />
                
                <div className="relative px-8 py-12 flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-36 h-36 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-indigo-500/30 backdrop-blur-md p-1 border border-white/10 ring-8 ring-white/5">
                            <div className="w-full h-full rounded-[2rem] bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-slate-500" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={handleAvatarClick}
                            disabled={uploading}
                            className="absolute -bottom-2 -right-2 p-3 bg-white text-primary rounded-2xl shadow-xl hover:scale-110 hover:rotate-6 transition-all duration-300 border border-slate-100 disabled:opacity-50"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex flex-col items-center md:items-start gap-4 text-white">
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black tracking-tight">{user?.name}</h2>
                            <p className="text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4 opacity-50" /> {user?.email}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {user?.verified ? (
                                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 px-4 py-1.5 rounded-full font-bold gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Đã xác minh
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-slate-500 border-slate-700 px-4 py-1.5 rounded-full font-bold">
                                   Chưa xác minh
                                </Badge>
                            )}
                            <div className="h-4 w-px bg-slate-700 mx-1 hidden md:block" />
                            <p className="text-slate-500 text-sm font-semibold">Thành viên từ {memberSince}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-black text-slate-800">Thông tin chi tiết</CardTitle>
                            <p className="text-sm text-slate-400 font-medium">Cập nhật thông tin định danh của bạn</p>
                        </div>
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`rounded-2xl px-6 font-bold transition-all duration-300 ${
                                isEditing 
                                ? "bg-rose-50 text-rose-500 hover:bg-rose-100" 
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
                        </Button>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3 group">
                                <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Họ và tên</Label>
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-primary/5 rounded-2xl transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-0 scale-95'}`} />
                                    <div className={`relative flex items-center gap-4 px-5 h-14 rounded-2xl transition-all duration-300 border-2 ${
                                        isEditing ? 'border-primary/20 bg-white shadow-lg shadow-primary/5' : 'border-transparent bg-slate-50/50'
                                    }`}>
                                        <UserIcon className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                                        {isEditing ? (
                                            <input 
                                                value={formData.name} 
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="bg-transparent border-none outline-none w-full font-bold text-slate-800 placeholder:text-slate-300"
                                                placeholder="Nhập họ tên"
                                            />
                                        ) : (
                                            <p className="font-bold text-slate-700">{user?.name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Số điện thoại</Label>
                                <div className="relative">
                                    <div className={`absolute inset-0 bg-primary/5 rounded-2xl transition-all duration-300 ${isEditing ? 'opacity-100' : 'opacity-0 scale-95'}`} />
                                    <div className={`relative flex items-center gap-4 px-5 h-14 rounded-2xl transition-all duration-300 border-2 ${
                                        isEditing ? 'border-primary/20 bg-white shadow-lg shadow-primary/5' : 'border-transparent bg-slate-50/50'
                                    }`}>
                                        <PhoneIcon className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                                        {isEditing ? (
                                            <input 
                                                value={formData.phone} 
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="bg-transparent border-none outline-none w-full font-bold text-slate-800 placeholder:text-slate-300"
                                                placeholder="09xx xxx xxx"
                                            />
                                        ) : (
                                            <p className="font-bold text-slate-700">{user?.phone || "Chưa cập nhật"}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Email liên hệ</Label>
                                <div className="flex items-center gap-4 px-5 h-14 rounded-2xl bg-slate-50/50 border-2 border-transparent text-slate-400 grayscale opacity-60 cursor-not-allowed">
                                    <Mail className="w-5 h-5" />
                                    <p className="font-bold">{user?.email}</p>
                                    <Badge variant="outline" className="ml-auto text-[10px] font-black tracking-widest uppercase border-slate-200">System Private</Badge>
                                </div>
                            </div>
                        </div>

                        {/* Bank Information Section */}
                        <div className="pt-8 border-t border-slate-50 space-y-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-800">Thông tin Ngân hàng (ATM)</h3>
                                <p className="text-sm text-slate-400 font-medium">Thông tin dùng để nhận thanh toán/hoàn tiền</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Ngân hàng</Label>
                                    <div className="relative">
                                        <div className={`flex items-center gap-4 px-5 h-14 rounded-2xl border-2 ${isEditing ? 'border-primary/20 bg-white' : 'border-transparent bg-slate-50/50'}`}>
                                            <ShieldCheck className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                                            {isEditing ? (
                                                <select
                                                    value={formData.bankCode}
                                                    onChange={(e) => {
                                                        const selected = banks.find(b => b.code === e.target.value);
                                                        setFormData({
                                                            ...formData, 
                                                            bankCode: e.target.value,
                                                            bankName: selected?.name || ""
                                                        });
                                                    }}
                                                    className="bg-transparent border-none outline-none w-full font-bold text-slate-800"
                                                >
                                                    <option value="">Chọn ngân hàng</option>
                                                    {banks.map(bank => (
                                                        <option key={bank.id} value={bank.code}>{bank.shortName} - {bank.name}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="font-bold text-slate-700">{user?.bankName || "Chưa cập nhật"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Số tài khoản</Label>
                                    <div className="relative">
                                        <div className={`flex items-center gap-4 px-5 h-14 rounded-2xl border-2 ${isEditing ? 'border-primary/20 bg-white' : 'border-transparent bg-slate-50/50'}`}>
                                            <Lock className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                                            {isEditing ? (
                                                <input 
                                                    value={formData.bankAccountNumber} 
                                                    onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})}
                                                    className="bg-transparent border-none outline-none w-full font-bold text-slate-800 placeholder:text-slate-300"
                                                    placeholder="Nhập số tài khoản"
                                                />
                                            ) : (
                                                <p className="font-bold text-slate-700">{user?.bankAccountNumber || "Chưa cập nhật"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Tên chủ tài khoản</Label>
                                    <div className="relative">
                                        <div className={`flex items-center gap-4 px-5 h-14 rounded-2xl border-2 ${isEditing ? 'border-primary/20 bg-white' : 'border-transparent bg-slate-50/50'}`}>
                                            <UserIcon className={`w-5 h-5 ${isEditing ? 'text-primary' : 'text-slate-400'}`} />
                                            {isEditing ? (
                                                <input 
                                                    value={formData.bankAccountName} 
                                                    onChange={(e) => setFormData({...formData, bankAccountName: e.target.value.toUpperCase()})}
                                                    className="bg-transparent border-none outline-none w-full font-bold text-slate-800 placeholder:text-slate-300 uppercase"
                                                    placeholder="NGUYEN VAN A"
                                                />
                                            ) : (
                                                <p className="font-bold text-slate-700">{user?.bankAccountName || "Chưa cập nhật"}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="pt-6 border-t border-slate-50">
                                <Button 
                                    onClick={handleUpdate} 
                                    disabled={loading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-16 font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] animate-in fade-in zoom-in-95 duration-300"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="w-6 h-6 animate-spin" /> Đang xử lý...
                                        </div>
                                    ) : "Xác nhận & Lưu thay đổi"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    {user?.isLoyalty ? (
                        <LoyaltyCard />
                    ) : (
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-gradient-to-br from-indigo-600 to-primary text-white rounded-[2rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black">Nâng cấp VIP?</h3>
                                    <p className="text-white/70 text-sm font-medium leading-relaxed">Hoàn thành 5 đơn đặt phòng để nhận thẻ VIP độc quyền.</p>
                                </div>
                                <Button 
                                    onClick={() => navigate("/profile/history")}
                                    variant="secondary" 
                                    className="w-full bg-white text-primary hover:bg-slate-50 rounded-2xl h-12 font-black shadow-lg shadow-black/10"
                                >
                                    Kiểm tra lịch sử
                                </Button>
                            </div>
                        </Card>
                    )}

                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] p-8 space-y-4 relative overflow-hidden group">
                         <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                 <ShieldCheck className="w-5 h-5" />
                             </div>
                             <h4 className="font-black text-slate-800">Bảo mật</h4>
                         </div>
                         <p className="text-xs text-slate-400 font-medium leading-relaxed">
                             Đổi mật khẩu thường xuyên giúp tài khoản của bạn luôn được bảo vệ an toàn.
                         </p>
                         <Button 
                            onClick={() => setShowPasswordModal(true)}
                            variant="outline" 
                            className="w-full border-slate-100 hover:bg-slate-50 text-slate-600 font-bold rounded-xl h-10 text-xs text-center justify-center"
                        >
                            Thay đổi mật khẩu
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                        <div className="relative h-32 bg-primary flex items-center justify-center">
                            <div className="absolute top-4 right-4">
                                <button 
                                    onClick={() => setShowPasswordModal(false)}
                                    className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl shadow-primary/20">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        
                        <form onSubmit={handlePasswordChange} className="p-10 space-y-6">
                            <div className="text-center space-y-1">
                                <h3 className="text-2xl font-black text-slate-800">Cập nhật mật khẩu</h3>
                                <p className="text-sm text-slate-400 font-medium">Đảm bảo tài khoản luôn được bảo vệ</p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu hiện tại</Label>
                                    <div className="relative">
                                        <input 
                                            type={showOldPassword ? "text" : "password"}
                                            required
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-slate-700 transition-all pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mật khẩu mới</Label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-slate-700 transition-all pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Xác nhận mật khẩu mới</Label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none font-bold text-slate-700 transition-all pr-12"
                                            placeholder="••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <Button 
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full h-14 bg-slate-900 border-none hover:bg-black text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 active:scale-95 transition-all mt-4"
                            >
                                {passwordLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : "Cập nhật mật khẩu"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
