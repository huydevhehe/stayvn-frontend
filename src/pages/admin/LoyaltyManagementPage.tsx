import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "@/api/userService";
import { useAuth } from "@/auth/AuthContext";
import { 
  Users, 
  Search, 
  Crown, 
  User as UserIcon, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Mail,
  Phone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const LoyaltyManagementPage: React.FC = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isGrantModalOpen, setIsGrantModalOpen] = React.useState(false);
  const [grantEmail, setGrantEmail] = React.useState("");
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => userService.getAllUsers(),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, isLoyalty }: { userId: number, isLoyalty: boolean }) => 
      userService.updateLoyaltyStatus(userId, isLoyalty),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      
      // Nếu Admin cập nhật chính mình, refresh lại AuthContext
      if (currentUser?.id === updatedUser.id) {
        refreshUser();
      }

      toast.success(updatedUser.isLoyalty ? `Đã cấp thẻ VIP cho ${updatedUser.name}` : `Đã thu hồi thẻ VIP của ${updatedUser.name}`);
      setIsGrantModalOpen(false);
      setGrantEmail("");
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái khách hàng");
    }
  });

  const handleGrantByEmail = () => {
    const userToGrant = users?.find(u => u.email?.toLowerCase() === grantEmail.toLowerCase());
    if (userToGrant) {
      if (userToGrant.isLoyalty) {
        toast.info("Khách hàng này đã có thẻ VIP rồi");
        return;
      }
      mutation.mutate({ userId: userToGrant.id, isLoyalty: true });
    } else {
      toast.error("Không tìm thấy khách hàng với email này trong hệ thống");
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-indigo-100/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Quản lý Khách hàng</h1>
          </div>
          <p className="text-slate-500 font-medium pl-1">Theo dõi, phân loại và quản lý đặc quyền khách hàng thân thiết</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 flex items-center gap-3">
              <Crown className="w-5 h-5 text-indigo-600 fill-indigo-600/20" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-400 leading-none mb-1">Khách thân thiết</span>
                <span className="text-lg font-black text-indigo-600 leading-none">
                   {users?.filter(u => u.isLoyalty).length || 0}
                </span>
              </div>
           </div>
           <Button 
            onClick={() => setIsGrantModalOpen(true)}
            className="h-14 px-8 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
           >
              <Crown className="w-5 h-5 fill-white" /> Cấp thẻ VIP
           </Button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Tìm theo tên hoặc email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 bg-white/60 backdrop-blur-md border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700"
          />
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 font-bold shadow-sm">
          <Filter className="w-4 h-4" /> Bộ lọc
        </Button>
      </div>

      {/* Users Table */}
      <Card className="border-none shadow-2xl shadow-indigo-100/50 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/40">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-400">Khách hàng</th>
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 italic">Vai trò</th>
                <th className="px-8 py-6 text-left text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                  Thân thiết <ArrowUpDown className="w-3 h-3" />
                </th>
                <th className="px-8 py-6 text-right text-[11px] font-black uppercase tracking-widest text-slate-400">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredUsers?.map((user, index) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden relative">
                           {user.isLoyalty ? (
                             <div className="absolute top-0 right-0 p-0.5 bg-indigo-600 rounded-bl-lg shadow-sm z-10">
                               <Crown className="w-2.5 h-2.5 text-white fill-white" />
                             </div>
                           ) : null}
                           <UserIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800 text-[15px]">{user.name}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                              <Mail className="w-3 h-3" /> {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 border-l border-slate-200 pl-3">
                                <Phone className="w-3 h-3" /> {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge className={cn(
                        "rounded-xl px-3 py-1 font-bold text-[10px] uppercase tracking-tighter",
                        user.role === "ADMIN" 
                          ? "bg-rose-50 text-rose-600 border border-rose-100" 
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      )}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={user.isLoyalty}
                          onCheckedChange={(checked) => mutation.mutate({ userId: user.id, isLoyalty: checked })}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                        <span className={cn(
                          "text-xs font-bold transition-all",
                          user.isLoyalty ? "text-indigo-600" : "text-slate-400"
                        )}>
                          {user.isLoyalty ? "Thân thiết" : "Khách thường"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       {user.isLoyalty ? (
                         <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl hover:bg-rose-50 text-rose-500 font-bold gap-2"
                          onClick={() => mutation.mutate({ userId: user.id, isLoyalty: false })}
                         >
                            <XCircle className="w-4 h-4" /> Thu hồi mác
                         </Button>
                       ) : (
                         <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-xl hover:bg-indigo-50 text-indigo-600 font-bold gap-2"
                          onClick={() => mutation.mutate({ userId: user.id, isLoyalty: true })}
                         >
                            <Crown className="w-4 h-4" /> Cấp mác VIP
                         </Button>
                       )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>
      {/* Grant VIP Modal */}
      <AnimatePresence>
        {isGrantModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-100 rounded-2xl">
                      <Crown className="w-6 h-6 text-amber-600 fill-amber-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Cấp thẻ VIP</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsGrantModalOpen(false)} className="rounded-full">
                    <XCircle className="w-6 h-6 text-slate-300" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Nhập Email khách hàng</label>
                    <Input 
                      placeholder="vidu@gmail.com" 
                      value={grantEmail}
                      onChange={(e) => setGrantEmail(e.target.value)}
                      className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-amber-500 font-bold"
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium px-1">
                    Hệ thống sẽ cấp thẻ VIP cho khách hàng này. Họ sẽ nhận được đặc quyền **Miễn cọc 100%** và hiệu ứng vương miện ngay lập tức.
                  </p>
                </div>

                <Button 
                  onClick={handleGrantByEmail}
                  disabled={mutation.isPending || !grantEmail}
                  className="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black shadow-lg shadow-amber-200"
                >
                  {mutation.isPending ? "Đang xử lý..." : "Xác nhận cấp đặc quyền"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default LoyaltyManagementPage;
