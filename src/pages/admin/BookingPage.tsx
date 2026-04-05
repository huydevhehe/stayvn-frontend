import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelService from "../../api/hotelService";
import bookingService from "../../api/bookingService";
import roomKeyService from "../../api/roomKeyService";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye, Home, ChevronRight, LogIn, LogOut, Key, ShieldAlert, Trash2 } from "lucide-react";
import { Booking, BookingStatus, RoomKey } from "../../types/admin";
import { Link } from "react-router-dom";

const BookingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedHotelId, setSelectedHotelId] = useState<number | "">("");
  const [selectedBookingKey, setSelectedBookingKey] = useState<RoomKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings", selectedHotelId],
    queryFn: () => selectedHotelId 
      ? bookingService.getHotelBookings(selectedHotelId as number)
      : bookingService.getAllBookings(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookingStatus }) =>
      bookingService.updateBookingStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", selectedHotelId] });
      toast.success("Đã cập nhật trạng thái đặt phòng");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi cập nhật trạng thái";
      toast.error(msg);
    },
  });

  const handleGenerateKey = async (bookingId: number) => {
    try {
      const key = await roomKeyService.generateKey(bookingId);
      setSelectedBookingKey(key);
      setIsModalOpen(true);
      toast.success("Đã cấp khóa điện tử thành công!");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Lỗi khi cấp khóa";
      toast.error(msg);
    }
  };

  const handleRevokeKey = async (bookingId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn thu hồi khóa điện tử này?")) return;
    try {
      await roomKeyService.revokeKey(bookingId);
      setIsModalOpen(false);
      toast.success("Đã thu hồi khóa thành công!");
    } catch (error) {
      toast.error("Lỗi khi thu hồi khóa");
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof Booking },
    { header: "Khách sạn", accessor: "hotelName" as keyof Booking },
    { header: "Phòng", accessor: "roomNumber" as keyof Booking },
    { header: "ID Người dùng", accessor: "userId" as keyof Booking },
    { header: "Ngày nhận phòng", accessor: "checkInDate" as keyof Booking },
    { header: "Ngày trả phòng", accessor: "checkOutDate" as keyof Booking },
    { 
      header: "Trạng thái", 
      accessor: (b: Booking) => {
        const isOverdue = b.status === BookingStatus.CHECKED_IN && new Date(b.checkOutDate) < new Date();
        return (
          <div className="flex flex-col gap-1">
            <span className={`px-2 py-1 rounded-full text-[10px] text-center font-bold ${
              b.status === BookingStatus.CONFIRMED ? "bg-green-100 text-green-700" : 
              b.status === BookingStatus.PENDING ? "bg-yellow-100 text-yellow-700" : 
              b.status === BookingStatus.CHECKED_IN ? (isOverdue ? "bg-red-100 text-red-600 animate-pulse" : "bg-blue-100 text-blue-700") :
              b.status === BookingStatus.CHECKED_OUT ? "bg-slate-100 text-slate-600" :
              b.status === BookingStatus.COMPLETED ? "bg-emerald-500 text-white shadow-sm" :
              "bg-red-100 text-red-700"
            }`}>
              {b.status === BookingStatus.CONFIRMED ? "ĐÃ THANH TOÁN" : 
               b.status === BookingStatus.PENDING ? "CHỜ XỬ LÝ" : 
               b.status === BookingStatus.CHECKED_IN ? (isOverdue ? "QUÁ HẠN TRẢ" : "ĐANG Ở") :
               b.status === BookingStatus.CHECKED_OUT ? "ĐÃ TRẢ PHÒNG" :
               b.status === BookingStatus.COMPLETED ? "HOÀN THÀNH ✨" :
               b.status === BookingStatus.CANCELLED ? "ĐÃ HỦY" : b.status}
            </span>
            {/* Tag nhỏ báo nếu chưa thanh toán */}
            {(b.status === BookingStatus.CHECKED_IN || b.status === BookingStatus.CHECKED_OUT) && (
              <span className="text-[9px] text-slate-400 text-center font-bold italic">Chưa thanh toán</span>
            )}
          </div>
        );
      } 
    },
    {
      header: "Thao tác",
      accessor: (b: Booking) => (
        <div className="flex items-center gap-2">
          {/* NÚT THANH TOÁN: Chỉ hiện nếu chưa thanh toán (CONFIRMED) và chưa hoàn thành (COMPLETED) */}
          {b.status !== BookingStatus.CONFIRMED && b.status !== BookingStatus.COMPLETED && b.status !== BookingStatus.CANCELLED && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => statusMutation.mutate({ id: b.id, status: BookingStatus.CONFIRMED })}
              className="text-green-600 hover:text-green-700 font-bold bg-green-50 h-8"
              title={b.status === BookingStatus.CHECKED_OUT ? "Thanh toán và kết thúc đơn" : "Xác nhận thanh toán"}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> {b.status === BookingStatus.CHECKED_OUT ? "Hoàn tất đơn" : "Thanh toán"}
            </Button>
          )}

          {/* NHẬN PHÒNG: Chỉ hiện khi Chờ xử lý hoặc Vừa thanh toán xong */}
          {(b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => statusMutation.mutate({ id: b.id, status: BookingStatus.CHECKED_IN })}
              className="text-blue-600 hover:text-blue-700 font-bold bg-blue-50 h-8"
            >
              <LogIn className="w-4 h-4 mr-1" /> Nhận phòng
            </Button>
          )}

          {/* TRẢ PHÒNG: Chỉ hiện khi Kháy đang ở */}
          {b.status === BookingStatus.CHECKED_IN && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => statusMutation.mutate({ id: b.id, status: BookingStatus.CHECKED_OUT })}
              className="text-slate-600 hover:text-slate-700 font-bold bg-slate-100 h-8"
            >
              <LogOut className="w-4 h-4 mr-1" /> Trả phòng
            </Button>
          )}

          {/* CẤP KHÓA ĐIỆN TỬ: Chỉ hiện khi đang ở (CHECKED_IN) */}
          {b.status === BookingStatus.CHECKED_IN && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleGenerateKey(b.id)}
              className="text-amber-600 hover:text-amber-700 font-bold bg-amber-50 h-8"
              title="Cấp/Quản lý khóa điện tử"
            >
              <Key className="w-4 h-4 mr-1" /> Khóa
            </Button>
          )}

          {/* HỦY: Chỉ cho phép khi chưa nhận phòng */}
          {(b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => statusMutation.mutate({ id: b.id, status: BookingStatus.CANCELLED })}
              className="text-red-500 hover:text-red-600 h-8"
              title="Hủy đơn"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
          <Link to={`/admin/payments?bookingId=${b.id}`}>
            <Button variant="ghost" size="sm" className="h-8" title="Xem chi tiết">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
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
        <span className="font-medium text-foreground">Đặt phòng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Đặt phòng</h2>
          <p className="text-muted-foreground mt-1">
            Theo dõi và quản lý việc đặt đơn phòng của khách hàng tại các cơ sở lưu trú.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <Label htmlFor="hotel-select" className="font-semibold text-slate-700">Bộ lọc khách sạn:</Label>
        <select
          id="hotel-select"
          className="bg-background border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer hover:border-primary"
          value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">-- Tất cả khách sạn --</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
        <DataTable columns={columns} data={bookings} isLoading={isLoading} />
      </div>

      {/* MODAL QUẢN LÝ KHÓA ĐIỆN TỬ (CUSTOM) */}
      {isModalOpen && selectedBookingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-amber-500 p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Quản lý Khóa Điện Tử</h3>
                  <p className="text-xs opacity-80 mt-1">Hệ thống cấp quyền truy cập an toàn</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phòng</p>
                  <p className="text-2xl font-black text-slate-800">{selectedBookingKey.roomNumber}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mã Access Code</p>
                  <p className="text-2xl font-mono font-bold text-amber-600 tracking-widest">{selectedBookingKey.accessCode}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex gap-3 text-sm text-slate-600">
                  <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                  <p>Mã này chỉ được cấp cho khách hàng. Nếu có nghi ngờ về bảo mật, hãy nhấn **Thu hồi** ngay lập tức.</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 border-slate-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  Đóng
                </Button>
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold"
                  onClick={() => handleRevokeKey(selectedBookingKey.bookingId)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Thu hồi khóa
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;