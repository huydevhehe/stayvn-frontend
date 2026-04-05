import React from "react";
import { useAuth } from "@/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import bookingService from "@/api/bookingService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ChevronRight, Loader2, Hotel as HotelIcon, CreditCard, Key, X, Sparkles } from "lucide-react";
import { BookingStatus } from "@/types/admin";
import roomImg1 from "@/assets/hotel-room-1.jpg";
import PaymentQRModal from "@/components/booking/PaymentQRModal";
import roomKeyService from "@/api/roomKeyService";
import DigitalKeyCard from "@/components/booking/DigitalKeyCard";

const statusConfig: Record<string, { label: string; className: string }> = {
  CHECKED_OUT: { label: "Đã hoàn thành", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  CHECKED_IN: { label: "Đang lưu trú", className: "bg-blue-50 text-blue-600 border-blue-100" },
  CONFIRMED: { label: "Sắp tới", className: "bg-blue-50 text-blue-600 border-blue-100" },
  CANCELLED: { label: "Đã hủy", className: "bg-rose-50 text-rose-600 border-rose-100" },
  PENDING: { label: "Chờ thanh toán", className: "bg-amber-50 text-amber-600 border-amber-100" },
  COMPLETED: { label: "Đã hoàn thành", className: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  RESALE: { label: "Đang rao nhượng", className: "bg-purple-50 text-purple-600 border-purple-100" },
};

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const MyBookingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = React.useState<any>(null);
  const [isQRModalOpen, setIsQRModalOpen] = React.useState(false);
  const [selectedKey, setSelectedKey] = React.useState<any>(null);
  const [isKeyModalOpen, setIsKeyModalOpen] = React.useState(false);
  const [isResaleModalOpen, setIsResaleModalOpen] = React.useState(false);
  const [resaleMessage, setResaleMessage] = React.useState("");
  const [isSubmittingResale, setIsSubmittingResale] = React.useState(false);
  
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["user-bookings"],
    queryFn: () => bookingService.getMyBookings(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Lịch sử chuyến đi</h1>
        <p className="text-slate-400 font-medium">Tìm thấy <span className="text-primary font-bold">{bookings?.length || 0}</span> đơn đặt phòng trong hệ thống</p>
      </div>

      <div className="grid gap-6">
        {bookings?.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50 rounded-[2.5rem] p-16 text-center">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
              <HotelIcon className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-bold text-slate-400">Bạn chưa có chuyến đi nào</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Khám phá những khách sạn tuyệt vời và bắt đầu hành trình của bạn ngay hôm nay!</p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-8 rounded-2xl px-8 font-bold bg-primary hover:bg-primary/90"
            >
              Khám phá ngay
            </Button>
          </Card>
        ) : (
          bookings?.map((booking) => {
            const config = statusConfig[booking.status] || { label: booking.status, className: "" };
            return (
              <div key={booking.id} className="relative group perspective-1000">
                <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] hover:scale-[1.01] transition-all duration-500">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                      <img 
                        src={roomImg1} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                        alt={booking.hotelName} 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-4">
                         <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 font-bold px-3 py-1 rounded-xl">
                           ID: #{booking.id.toString().padStart(6, '0')}
                         </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-between relative">
                      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 rounded-full -translate-y-1/2 hidden md:block border-r border-slate-100 shadow-inner" />
                      
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="font-black text-2xl text-slate-800 tracking-tight leading-none group-hover:text-primary transition-colors">{booking.hotelName}</h3>
                            <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                               <MapPin className="w-3.5 h-3.5" /> {booking.roomNumber}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <Badge className={`rounded-full px-4 py-1.5 font-bold tracking-tight shadow-sm border-2 ${config.className}`}>
                                {config.label}
                             </Badge>
                             {booking.isResalePurchase && (
                               <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-none font-black px-3 py-1 rounded-lg flex items-center gap-1 animate-pulse shadow-lg shadow-purple-200">
                                 <Sparkles className="w-3 h-3" /> Deal Nhượng Phòng -30%
                               </Badge>
                             )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8 py-4 border-y border-dashed border-slate-100">
                           <div className="space-y-1">
                             <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">Check In</p>
                             <p className="font-bold text-slate-700">{booking.checkInDate}</p>
                           </div>
                           <div className="space-y-1 text-right md:text-left">
                             <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">Check Out</p>
                             <p className="font-bold text-slate-700">{booking.checkOutDate}</p>
                           </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex flex-col">
                           <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">Tổng thanh toán</p>
                           <p className="font-black text-primary text-2xl tracking-tighter">{formatVND(booking.totalPrice || 0)}</p>
                        </div>
                        <div className="flex gap-2">
                           {booking.status === "CONFIRMED" && (
                             <Button 
                               onClick={() => {
                                 setSelectedBooking(booking);
                                 setIsResaleModalOpen(true);
                               }}
                               className="rounded-2xl h-12 px-6 font-black bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-200 transition-all active:scale-[0.98] gap-2"
                             >
                               <CreditCard className="w-4 h-4 rotate-12" /> Pass phòng (-30%)
                             </Button>
                           )}

                           {booking.status === "PENDING" && (
                             <Button 
                               onClick={() => {
                                 setSelectedBooking(booking);
                                 setIsQRModalOpen(true);
                               }}
                               className="rounded-2xl h-12 px-6 font-black bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all active:scale-[0.98] gap-2"
                             >
                               <CreditCard className="w-4 h-4" /> Thanh toán ngay
                             </Button>
                           )}

                           {booking.status === "CHECKED_IN" && (
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
                               className="rounded-2xl h-12 px-6 font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 transition-all active:scale-[0.98] gap-2"
                             >
                               <Key className="w-4 h-4" /> Mở khóa điện tử
                             </Button>
                           )}

                           <Button 
                             onClick={() => navigate(`/hotel/${booking.hotelId}`)}
                             className="rounded-2xl h-12 px-6 font-black bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 transition-all active:scale-[0.98] gap-2"
                           >
                             Xem chi tiết <ChevronRight className="w-4 h-4" />
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })
        )}
      </div>

      <PaymentQRModal 
        isOpen={isQRModalOpen} 
        onClose={() => setIsQRModalOpen(false)} 
        booking={selectedBooking} 
        onPaid={() => refetch()} 
      />

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

      {/* Resale Modal */}
      {isResaleModalOpen && selectedBooking && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white animate-in zoom-in-95 duration-300">
            <div className="bg-purple-600 p-8 text-white relative">
              <button 
                onClick={() => setIsResaleModalOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-black tracking-tight mb-2">Nhượng lại phòng</h3>
              <p className="text-purple-100 text-sm font-medium opacity-90">Hệ thống sẽ tự động giảm giá 30% để giúp bạn pass phòng nhanh nhất.</p>
            </div>
            
            <CardContent className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4 border border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Giá gốc</span>
                  <span className="line-through text-slate-400 font-bold">{formatVND(selectedBooking.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-black">Giá nhượng (-30%)</span>
                  <span className="text-2xl font-black text-purple-600">{formatVND(selectedBooking.totalPrice * 0.7)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Lời nhắn gửi người mua</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-purple-600/20 focus:bg-white outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 resize-none"
                  placeholder="Ví dụ: Mình có việc bận đột xuất nên cần pass lại phòng giá rẻ cho bạn nào cần..."
                  value={resaleMessage}
                  onChange={(e) => setResaleMessage(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  onClick={() => setIsResaleModalOpen(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl h-14 font-black border-2 border-slate-100 hover:bg-slate-50 text-slate-400"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  disabled={isSubmittingResale}
                  onClick={async () => {
                    setIsSubmittingResale(true);
                    try {
                      await bookingService.listForResale(selectedBooking.id, resaleMessage);
                      setIsResaleModalOpen(false);
                      setResaleMessage("");
                      refetch();
                      alert("Đơn hàng của bạn đã được đưa lên sàn nhượng phòng!");
                    } catch (err) {
                      alert("Lỗi khi đăng nhượng phòng. Vui lòng thử lại!");
                    } finally {
                      setIsSubmittingResale(false);
                    }
                  }}
                  className="flex-3 rounded-2xl h-14 px-8 font-black bg-purple-600 hover:bg-purple-700 text-white shadow-xl shadow-purple-200 gap-2"
                >
                  {isSubmittingResale ? <Loader2 className="w-5 h-5 animate-spin" /> : "Xác nhận đăng tin"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
