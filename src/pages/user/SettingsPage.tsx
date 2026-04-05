import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  ShieldCheck, 
  Globe, 
  Languages, 
  Coins,
  Shield,
  Fingerprint,
  Eye
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { toast } from "sonner";

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState({
    booking: true,
    marketing: true,
    security: true
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    twoFactor: false
  });

  const handleSave = () => {
    toast.success("Cài đặt của bạn đã được lưu thành công!");
  };

  const handleReset = () => {
    setNotifications({
      booking: true,
      marketing: true,
      security: true
    });
    setPrivacy({
      publicProfile: false,
      twoFactor: false
    });
    toast.info("Đã khôi phục cài đặt mặc định");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Cài đặt tài khoản</h1>
        <p className="text-slate-400 font-medium">Tùy chỉnh trải nghiệm của bạn trên hệ thống</p>
      </div>

      <div className="grid gap-8">
        {/* Notifications Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Bell className="w-6 h-6" />
              </div>
              Thông báo hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="flex items-center justify-between group p-3 hover:bg-slate-50/50 rounded-[1.5rem] transition-all">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-700 group-hover:text-primary transition-colors">Thông báo đặt phòng</Label>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Nhận thông tin cập nhật về trạng thái đơn hàng và lịch trình.</p>
              </div>
              <Switch 
                checked={notifications.booking} 
                onCheckedChange={(val) => setNotifications({...notifications, booking: val})} 
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="h-px bg-slate-50 mx-4" />

            <div className="flex items-center justify-between group p-3 hover:bg-slate-50/50 rounded-[1.5rem] transition-all">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-700 group-hover:text-primary transition-colors">Ưu đãi & Khuyến mãi</Label>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Nhận tin tức về các chương trình giảm giá và ưu đãi đặc quyền.</p>
              </div>
              <Switch 
                checked={notifications.marketing} 
                onCheckedChange={(val) => setNotifications({...notifications, marketing: val})} 
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              Bảo mật & Quyền riêng tư
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-6">
            <div className="flex items-center justify-between group p-3 hover:bg-slate-50/50 rounded-[1.5rem] transition-all">
              <div className="space-y-1">
                <Label className="text-base font-black text-slate-700">Hiển thị hồ sơ công khai</Label>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Cho phép người dùng khác xem được tên và đánh giá của bạn.</p>
              </div>
              <Switch 
                checked={privacy.publicProfile} 
                onCheckedChange={(val) => setPrivacy({...privacy, publicProfile: val})} 
                className="data-[state=checked]:bg-rose-500"
              />
            </div>

            <div className="h-px bg-slate-50 mx-4" />

            <div className="flex items-center justify-between group p-3 hover:bg-slate-50/50 rounded-[1.5rem] transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <Label className="text-base font-black text-slate-700">Xác thực hai lớp (2FA)</Label>
                   <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-amber-100 text-[10px] font-black tracking-widest uppercase py-0.5">Beta</Badge>
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">Yêu cầu mã xác minh mỗi khi đăng nhập từ thiết bị mới.</p>
              </div>
              <Switch 
                checked={privacy.twoFactor} 
                onCheckedChange={(val) => setPrivacy({...privacy, twoFactor: val})} 
                className="data-[state=checked]:bg-rose-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Section */}
        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Globe className="w-6 h-6" />
              </div>
              Ngôn ngữ & Khu vực
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Ngôn ngữ hiển thị</Label>
                <Select defaultValue="vi">
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-none font-bold text-slate-700 shadow-inner">
                    <SelectValue placeholder="Chọn ngôn ngữ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English (Coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-black ml-1">Tiền tệ ưu tiên</Label>
                <Select defaultValue="vnd">
                  <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-none font-bold text-slate-700 shadow-inner">
                    <SelectValue placeholder="Chọn tiền tệ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    <SelectItem value="vnd">VND (đ)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4 px-4 pt-4">
          <Button 
            variant="ghost" 
            onClick={handleReset}
            className="rounded-2xl font-black text-slate-400 px-8 h-12 hover:bg-slate-100"
          >
            Khôi phục mặc định
          </Button>
          <Button 
            onClick={handleSave}
            className="rounded-2xl font-black bg-slate-900 hover:bg-black text-white px-12 h-14 shadow-2xl shadow-slate-900/20 transition-all active:scale-[0.98]"
          >
            Lưu tất cả thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
