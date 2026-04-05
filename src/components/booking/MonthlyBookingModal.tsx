import React, { useState } from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CreditCard, Info } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { toast } from "sonner";
import monthlyBookingService from "@/api/monthlyBookingService";
import { MonthlyRental } from "@/types/admin";
import { useNavigate } from "react-router-dom";

interface MonthlyBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    rental: MonthlyRental;
}

const MonthlyBookingModal: React.FC<MonthlyBookingModalProps> = ({ isOpen, onClose, rental }) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80";
    
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form States
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [duration, setDuration] = useState(rental.minContractMonths || 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Vui lòng đăng nhập để đặt thuê phòng trọ");
            navigate("/login");
            return;
        }

        try {
            setIsSubmitting(true);
            // Theo monthlyBookingService.ts: book(userId, rentalId, startDate, months)
            await monthlyBookingService.book(user.id, rental.id, startDate, duration);
            
            toast.success("Đặt thuê thành công! Admin sẽ liên hệ bạn sớm.");
            onClose();
            navigate("/profile/rentals");
        } catch (error: any) {
            console.error("Booking failed:", error);
            toast.error(error.response?.data?.message || "Lỗi khi đặt thuê. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const displayImageUrl = (() => {
        if (!rental.imageUrls || rental.imageUrls.length === 0) return DEFAULT_IMAGE;
        const firstUrl = rental.imageUrls[0];
        if (firstUrl.startsWith('data:') || firstUrl.includes('placeholder')) return DEFAULT_IMAGE;
        return firstUrl.startsWith('http') ? firstUrl : `${API_URL}${firstUrl}`;
    })();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Xác nhận đặt thuê & Đặt cọc"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                            src={displayImageUrl} 
                            className="w-full h-full object-cover" 
                            alt={rental.name} 
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground line-clamp-1">{rental.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{rental.address}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" /> Ngày dự kiến dời vào
                        </Label>
                        <Input 
                            id="startDate" 
                            type="date" 
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="rounded-xl h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration" className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> Thời hạn thuê (tháng)
                        </Label>
                        <Input 
                            id="duration" 
                            type="number" 
                            required
                            min={rental.minContractMonths}
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value))}
                            className="rounded-xl h-12"
                        />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl space-y-3 border border-slate-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Giá thuê hằng tháng:</span>
                        <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.monthlyPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kỳ hạn tối thiểu:</span>
                        <span className="font-bold">{rental.minContractMonths} tháng</span>
                    </div>
                    <Separator className="bg-slate-200" />
                    <div className="flex justify-between items-center pt-1">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <span className="font-bold text-foreground">Tổng tiền đặt cọc:</span>
                        </div>
                        <span className="text-2xl font-black text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.deposit)}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-800 leading-relaxed">
                        Bằng việc nhấn xác nhận, bạn đồng ý với việc đặt cọc giữ chỗ cho căn trọ này. StayVN sẽ bảo vệ số tiền cọc của bạn cho đến khi hợp đồng chính thức được ký kết.
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 rounded-xl h-12" onClick={onClose} disabled={isSubmitting}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" className="flex-1 rounded-xl h-12 shadow-lg" disabled={isSubmitting}>
                        {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt cọc"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MonthlyBookingModal;
