import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import monthlyBookingService from "../../api/monthlyBookingService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { FileText, CheckCircle, XCircle, Home, ChevronRight, Eye } from "lucide-react";
import { MonthlyBooking } from "../../types/admin";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const AdminMonthlyBookingPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [selectedBooking, setSelectedBooking] = useState<MonthlyBooking | null>(null);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);

    // ===================== QUERIES =====================
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["admin-monthly-bookings"],
        queryFn: monthlyBookingService.getAll,
    });

    // ===================== MUTATIONS =====================
    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => 
            monthlyBookingService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-monthly-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["monthly-rentals"] });
            toast.success("Cập nhật trạng thái đơn thuê thành công!");
        },
        onError: () => toast.error("Lỗi khi cập nhật trạng thái"),
    });

    // ===================== TABLE COLUMNS =====================
    const columns = [
        { header: "Mã đơn", accessor: (b: MonthlyBooking) => `#MB${b.id}` },
        { 
            header: "Người thuê", 
            accessor: (b: MonthlyBooking) => (
                <div className="flex flex-col">
                    <span className="font-bold">{b.userName}</span>
                    <span className="text-[10px] text-muted-foreground">ID: {b.userId}</span>
                </div>
            ) 
        },
        { header: "Phòng trọ", accessor: "rentalName" as const },
        { header: "Địa chỉ", accessor: "address" as const },
        { 
            header: "Thời hạn", 
            accessor: (b: MonthlyBooking) => (
                <div className="text-xs">
                    <p>Bắt đầu: {format(new Date(b.startDate), "dd/MM/yyyy")}</p>
                    <p>{b.contractMonths} tháng</p>
                </div>
            ) 
        },
        { 
            header: "Tiền cọc", 
            accessor: (b: MonthlyBooking) => (
                <span className="font-semibold text-primary">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(b.depositAmount)}
                </span>
            )
        },
        { 
            header: "Trạng thái", 
            accessor: (b: MonthlyBooking) => {
                const colors: Record<string, string> = {
                    PENDING: "bg-amber-100 text-amber-700",
                    CONFIRMED: "bg-blue-100 text-blue-700",
                    ACTIVE: "bg-green-100 text-green-700",
                    CANCELLED: "bg-red-100 text-red-700",
                    COMPLETED: "bg-slate-100 text-slate-700",
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${colors[b.status] || "bg-gray-100"}`}>
                        {b.status}
                    </span>
                );
            }
        },
        {
            header: "Thao tác",
            accessor: (b: MonthlyBooking) => (
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                            setSelectedBooking(b);
                            setIsContractModalOpen(true);
                        }}
                        title="Xem hợp đồng"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    
                    {b.status === "PENDING" && (
                        <>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-success hover:text-success hover:bg-success/10"
                                onClick={() => {
                                    if (confirm("Xác nhận đã nhận tiền cọc và duyệt đơn thuê này?")) {
                                        statusMutation.mutate({ id: b.id, status: "CONFIRMED" });
                                    }
                                }}
                            >
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                    if (confirm("Bạn có chắc chắn muốn hủy đơn thuê này không?")) {
                                        statusMutation.mutate({ id: b.id, status: "CANCELLED" });
                                    }
                                }}
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </>
                    )}

                    {b.status === "CONFIRMED" && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] h-7"
                            onClick={() => statusMutation.mutate({ id: b.id, status: "ACTIVE" })}
                        >
                            Kích hoạt thuê
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
                <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" /> Bảng điều khiển
                </Link>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                <span className="font-medium text-foreground">Đơn thuê trọ</span>
            </nav>

            <div>
                <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">
                    Quản lý Đơn thuê trọ
                </h2>
                <p className="text-muted-foreground mt-1">
                    Theo dõi yêu cầu đặt cọc và phê duyệt hợp đồng thuê trọ tháng.
                </p>
            </div>

            <DataTable columns={columns} data={bookings} isLoading={isLoading} />

            {/* Hợp đồng Modal */}
            <Modal
                isOpen={isContractModalOpen}
                onClose={() => setIsContractModalOpen(false)}
                title="Hợp đồng điện tử / Xác nhận đặt cọc"
            >
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 font-mono text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                    {selectedBooking?.contractContent || "Không có nội dung hợp đồng"}
                </div>
                <div className="flex justify-end mt-6">
                    <Button onClick={() => window.print()} className="gap-2">
                        <FileText className="w-4 h-4" /> In hợp đồng (PDF)
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminMonthlyBookingPage;
