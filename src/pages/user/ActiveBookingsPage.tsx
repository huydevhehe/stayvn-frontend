import React from "react";
import { Card } from "@/components/ui/card";
import { ClipboardList, Loader2, MapPin, Calendar as CalendarIcon, ChevronRight, Key } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import bookingService from "@/api/bookingService";
import roomKeyService from "@/api/roomKeyService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus, RoomKey } from "@/types/admin";
import { useAuth } from "@/auth/useAuth";
import DigitalKeyCard from "@/components/booking/DigitalKeyCard";
import { X } from "lucide-react";
import roomImg1 from "@/assets/hotel-room-1.jpg";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const ActiveBookingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedKey, setSelectedKey] = React.useState<RoomKey | null>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = React.useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["active-bookings"],
    queryFn: async () => {
      const all = await bookingService.getMyBookings();
      // Show PENDING, CONFIRMED, or CHECKED_IN
      return all.filter(b => 
        b.status === BookingStatus.PENDING || 
        b.status === BookingStatus.CONFIRMED || 
        b.status === BookingStatus.CHECKED_IN
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasBookings = bookings && bookings.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Đơn đang đặt</h1>
        <p className="text-slate-400 font-medium">Quản lý các chuyến đi sắp tới của bạn</p>
      </div>

      {!hasBookings ? (
        <Card className="border-dashed border-2 border-slate-100 shadow-none bg-white rounded-[2.5rem] p-20 text-center min-h-[450px] flex flex-col items-center justify-center group">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8 rotate-3 group-hover:rotate-6 transition-transform duration-500">
              <ClipboardList className="w-12 h-12 text-primary/20" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
               <span className="text-xs font-black text-slate-300">0</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-800">Chưa có chuyến đi sắp tới</h3>
          <p className="text-slate-400 font-medium mt-3 max-w-sm mx-auto leading-relaxed">
            Mọi thông tin về đơn đặt phòng đang xử lý hoặc sắp khởi hành sẽ xuất hiện tại đây. 
            Bắt đầu lên kế hoạch ngay!
          </p>
          <button 
            onClick={() => navigate("/")}
            className="mt-10 px-10 h-14 bg-slate-900 text-white rounded-2xl font-black shadow-2xl shadow-slate-900/10 hover:bg-black transition-all active:scale-95"
          >
            Tìm khách sạn ưng ý
          </button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-none shadow-xl shadow-slate-200/40 bg-white rounded-[2rem] hover:scale-[1.01] transition-all duration-500 p-6">
              <div className="flex gap-6">
                <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                  <img src={roomImg1} className="w-full h-full object-cover" alt={booking.hotelName} />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-xl text-slate-800">{booking.hotelName}</h3>
                      <p className="text-slate-400 text-sm font-bold flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {booking.roomNumber}
                      </p>
                    </div>
                    <Badge className={`rounded-full px-4 py-1 border-none font-black ${
                      booking.status === BookingStatus.CHECKED_IN ? "bg-blue-500 text-white animate-pulse" :
                      booking.status === BookingStatus.PENDING ? "bg-amber-50 text-amber-600" :
                      "bg-green-50 text-green-600"
                    }`}>
                      {booking.status === BookingStatus.CHECKED_IN ? "ĐANG Ở ĐÂY ✨" :
                       booking.status === BookingStatus.PENDING ? "CHỜ XÁC NHẬN" : "SẮP KHỞI HÀNH"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 font-black text-slate-600">
                      <CalendarIcon className="w-3.5 h-3.5" /> {booking.checkInDate}
                    </div>
                    <span>→</span>
                    <div className="text-slate-600">{booking.checkOutDate}</div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="font-black text-primary text-xl tracking-tighter">{formatVND(booking.totalPrice || 0)}</p>
                    <Button 
                      onClick={() => navigate(`/hotel/${booking.hotelId}`)}
                      variant="ghost" 
                      className="text-slate-800 font-black hover:bg-slate-100 rounded-xl gap-1"
                    >
                      Chi tiết <ChevronRight className="w-4 h-4" />
                    </Button>
                    
                    {/* NÚT MỞ KHÓA ĐIỆN TỬ: Chỉ hiện khi Đang ở */}
                    {booking.status === BookingStatus.CHECKED_IN && (
                      <Button 
                        onClick={async () => {
                          if (!user?.id) return;
                          try {
                            const key = await roomKeyService.getMyActiveKey(user.id);
                            setSelectedKey(key);
                            setIsKeyModalOpen(true);
                          } catch (err) {
                            alert("Chưa có khóa điện tử cho phòng này. Vui lòng liên hệ Admin!");
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl gap-2 shadow-lg shadow-indigo-200"
                      >
                        <Key className="w-4 h-4" /> Mở khóa điện tử
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL HIỂN THỊ THẺ TỪ CỦA KHÁCH */}
      {isKeyModalOpen && selectedKey && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
          <div className="relative w-full max-w-sm flex flex-col items-center">
            <button 
              onClick={() => setIsKeyModalOpen(false)}
              className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
            <DigitalKeyCard roomKey={selectedKey} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBookingsPage;
