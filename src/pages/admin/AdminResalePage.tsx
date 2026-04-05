import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/api/bookingService";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, ExternalLink, Calendar, Tag, MessageSquare, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { Booking, BookingStatus } from "@/types/admin";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const AdminResalePage: React.FC = () => {
    const queryClient = useQueryClient();
    
    const { data: resales = [], isLoading } = useQuery({
        queryKey: ["admin-resales"],
        queryFn: () => bookingService.getResaleBookings(),
    });

    const removeListingMutation = useMutation({
        mutationFn: async (id: number) => {
            return bookingService.updateBookingStatus(id, { status: BookingStatus.CONFIRMED });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-resales"] });
            toast.success("Đã gỡ bỏ tin nhượng phòng thành công.");
        }
    });

    const columns = [
        { 
            header: "Thông tin phòng", 
            accessor: (b: Booking) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Tag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 tracking-tight">{b.hotelName}</p>
                        <p className="text-slate-400 text-[10px] font-black uppercase">Phòng: {b.roomNumber}</p>
                    </div>
                </div>
            )
        },
        { 
            header: "Thời gian", 
            accessor: (b: Booking) => (
                <div className="flex flex-col gap-1 items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 w-fit mx-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600">
                        <Calendar className="w-3 h-3 text-primary" /> {b.checkInDate}
                    </div>
                    <div className="w-4 h-0.5 bg-slate-200 rounded-full" />
                    <div className="text-[10px] font-black text-slate-400">{b.checkOutDate}</div>
                </div>
            )
        },
        { 
            header: "Giá Gốc", 
            accessor: (b: Booking) => (
                <p className="text-slate-400 line-through text-xs font-bold text-center">
                    {formatVND(b.totalPrice || 0)}
                </p>
            )
        },
        { 
            header: "Giá Nhượng", 
            accessor: (b: Booking) => (
                <div className="flex flex-col items-center gap-1">
                    <Badge className="bg-emerald-500 text-white border-none font-black px-3 py-0.5 rounded-full text-[10px] shadow-sm">
                        {formatVND(b.resalePrice || (b.totalPrice || 0) * 0.7)}
                    </Badge>
                    <span className="text-[9px] text-emerald-600 font-bold tracking-tight flex items-center gap-0.5">
                        <TrendingDown className="w-2.5 h-2.5" /> -30%
                    </span>
                </div>
            )
        },
        { 
            header: "Lời nhắn", 
            accessor: (b: Booking) => (
                <div className="flex items-start gap-2 text-slate-500 italic text-[11px] font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-[200px]">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-300 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">"{b.resaleMessage || "Không có lời nhắn"}"</p>
                </div>
            )
        },
        {
            header: "Thao tác",
            accessor: (b: Booking) => (
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg border border-slate-100 hover:bg-white hover:text-primary hover:border-primary transition-all active:scale-95"
                        onClick={() => window.open(`/hotel/${b.hotelId}`, "_blank")}
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
                        onClick={() => {
                            if (confirm("Bạn có chắc chắn muốn gỡ đơn nhượng phòng này không?")) {
                                removeListingMutation.mutate(b.id);
                            }
                        }}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Nhượng phòng</h1>
                <p className="text-muted-foreground mt-1">
                    Theo dõi và kiểm tra các đơn phòng đang được rao nhượng trên toàn hệ thống (Chợ 30%).
                </p>
            </div>

            <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
                <DataTable columns={columns} data={resales} isLoading={isLoading} />
            </div>
        </div>
    );
};

export default AdminResalePage;
