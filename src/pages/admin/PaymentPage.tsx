import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import paymentService from "../../api/paymentService";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle, Home, ChevronRight } from "lucide-react";
import { Payment } from "../../types/admin";
import { Link } from "react-router-dom";

const PaymentPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [inputBookingId, setInputBookingId] = React.useState(bookingId || "");

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments", bookingId],
    queryFn: () => paymentService.getPaymentsByBookingId(Number(bookingId)),
    enabled: !!bookingId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      paymentService.updatePaymentStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments", bookingId] });
      toast.success("Đã cập nhật trạng thái thanh toán");
    },
    onError: () => toast.error("Lỗi khi cập nhật trạng thái thanh toán"),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputBookingId) {
      setSearchParams({ bookingId: inputBookingId });
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof Payment },
    { header: "Số tiền", accessor: (p: Payment) => `${p.amount.toLocaleString()} VNĐ` },
    { header: "Phương thức", accessor: "paymentMethod" as keyof Payment },
    { 
      header: "Trạng thái", 
      accessor: (p: Payment) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          p.status === "COMPLETED" ? "bg-green-100 text-green-700" : 
          p.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
          "bg-red-100 text-red-700"
        }`}>
          {p.status === "COMPLETED" ? "HOÀN THÀNH" : 
           p.status === "PENDING" ? "CHỜ XỬ LÝ" : 
           p.status === "FAILED" ? "THẤT BẠI" : p.status}
        </span>
      ) 
    },
    {
      header: "Thao tác",
      accessor: (p: Payment) => (
        <div className="flex items-center gap-2">
          {p.status === "PENDING" && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => statusMutation.mutate({ id: p.id, status: "COMPLETED" })}
                className="text-green-600"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => statusMutation.mutate({ id: p.id, status: "FAILED" })}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4" /> Fail
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BREADCRUMBS */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Thanh toán</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Thanh toán</h2>
          <p className="text-muted-foreground mt-1">
            Theo dõi các giao dịch và hồ sơ tài chính.
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex items-end gap-4 bg-card p-4 rounded-xl border">
        <div className="flex-1 space-y-2">
          <Label htmlFor="booking-id">ID Đặt phòng:</Label>
          <Input 
            id="booking-id" 
            placeholder="Nhập ID Đặt phòng để xem thanh toán" 
            value={inputBookingId}
            onChange={(e) => setInputBookingId(e.target.value)}
          />
        </div>
        <Button type="submit">Tìm kiếm thanh toán</Button>
      </form>

      {bookingId ? (
        <DataTable columns={columns} data={payments} isLoading={isLoading} />
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Nhập ID Đặt phòng để xem thông tin thanh toán.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
