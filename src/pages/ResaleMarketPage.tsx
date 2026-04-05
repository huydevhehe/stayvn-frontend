import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bookingService from "@/api/bookingService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, MapPin, Loader2, Hotel as HotelIcon, TrendingDown, Info, Sparkles, ArrowRight } from "lucide-react";
import roomImg1 from "@/assets/hotel-room-1.jpg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const ResaleMarketPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const { data: resales, isLoading } = useQuery({
        queryKey: ["resale-bookings"],
        queryFn: () => bookingService.getResaleBookings(),
    });

    const buyMutation = useMutation({
        mutationFn: (bookingId: number) => bookingService.buyResale(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resale-bookings"] });
            queryClient.invalidateQueries({ queryKey: ["user-bookings"] });
            toast.success("Chúc mừng! Bạn đã mua lại phòng thành công. Kiểm tra trong Lịch sử chuyến đi nhé!", {
                icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
                duration: 5000,
            });
            navigate("/profile/history");
        },
        onError: () => {
            toast.error("Có lỗi xảy ra khi mua phòng. Vui lòng thử lại!");
        }
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                <p className="text-slate-400 font-bold animate-pulse">Đang săn tìm các kèo thơm...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 p-12 md:p-20 text-white shadow-2xl shadow-purple-900/20">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-600/20 to-transparent pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/30 blur-[100px] rounded-full" />
                
                <div className="relative z-10 max-w-2xl space-y-6">
                    <Badge className="bg-purple-500 hover:bg-purple-500 text-white border-none px-4 py-1.5 rounded-full font-black text-xs tracking-widest uppercase">
                        Chợ Nhượng Phòng StayVN
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none">
                        Săn phòng giá hời, <br /> 
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">Tiết kiệm tới 30%</span>
                    </h1>
                    <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-lg">
                        Cơ hội sở hữu những phòng khách sạn cao cấp với mức giá không tưởng từ cộng đồng người dùng StayVN.
                    </p>
                </div>
            </div>

            {/* Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { icon: <TrendingDown className="w-6 h-6 text-emerald-500" />, title: "Giảm 30% mặc định", desc: "Mọi phòng nhượng lại đều rẻ hơn ít nhất 30% giá gốc." },
                    { icon: <Info className="w-6 h-6 text-blue-500" />, title: "Chuyển tên tức thì", desc: "Sau khi mua, thông tin đặt phòng sẽ thuộc về bạn ngay lập tức." },
                    { icon: <HotelIcon className="w-6 h-6 text-purple-500" />, title: "Uy tín 100%", desc: "Mọi giao dịch đều được StayVN bảo đảm và kiểm soát chặt chẽ." },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">{item.icon}</div>
                        <h4 className="text-lg font-black text-slate-800 mb-2">{item.title}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>

            {/* List Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        Danh sách đang nhượng <span className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">{resales?.length || 0}</span>
                    </h2>
                </div>

                {resales?.length === 0 ? (
                    <Card className="border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50 rounded-[3rem] p-24 text-center">
                        <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-8">
                            <HotelIcon className="w-12 h-12 text-slate-200" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-400 tracking-tight">Hiện chưa có kèo nào...</h3>
                        <p className="text-slate-400 font-medium mt-3 max-w-sm mx-auto">Hãy quay lại sau hoặc là người đầu tiên đăng nhượng phòng của bạn nhé!</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {resales?.map((booking) => (
                            <Card key={booking.id} className="group border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white hover:scale-[1.02] transition-all duration-500 hover:shadow-purple-200/50">
                                <div className="h-56 relative overflow-hidden">
                                    <img src={roomImg1} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={booking.hotelName} />
                                    <Badge className="absolute top-6 left-6 bg-purple-600 text-white border-none px-4 py-1.5 rounded-full font-black text-xs shadow-lg">
                                        TIẾT KIỆM 30%
                                    </Badge>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                    <div className="absolute bottom-6 left-6 text-white space-y-1">
                                        <h3 className="font-black text-xl tracking-tight leading-none">{booking.hotelName}</h3>
                                        <p className="text-white/80 text-xs font-bold flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3" /> {booking.roomNumber}
                                        </p>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex justify-between items-start border-b border-slate-50 pb-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[10px] uppercase tracking-widest font-black text-slate-300">Thời gian lưu trú</p>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-slate-50 px-3 py-2 rounded-xl text-center">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">In</p>
                                                    <p className="font-bold text-slate-700 text-sm">{booking.checkInDate}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-slate-200" />
                                                <div className="bg-slate-50 px-3 py-2 rounded-xl text-center">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Out</p>
                                                    <p className="font-bold text-slate-700 text-sm">{booking.checkOutDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                                        <p className="text-[10px] uppercase tracking-widest font-black text-purple-300 mb-2">Lời nhắn từ người bán</p>
                                        <p className="text-purple-900 text-sm font-medium leading-relaxed italic">
                                            "{booking.resaleMessage || "Mình bận việc nên cần nhượng lại gấp phòng này, cảm ơn các bạn!"}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="space-y-1">
                                            <span className="line-through text-slate-300 font-bold text-sm">{formatVND(booking.totalPrice)}</span>
                                            <p className="text-2xl font-black text-purple-600 tracking-tighter leading-none">{formatVND(booking.resalePrice || booking.totalPrice * 0.7)}</p>
                                        </div>
                                        <Button 
                                            onClick={() => buyMutation.mutate(booking.id)}
                                            disabled={buyMutation.isPending}
                                            className="rounded-2xl h-14 px-8 font-black bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 transition-all active:scale-[0.98] gap-3"
                                        >
                                            {buyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                <>
                                                    Mua ngay <ShoppingCart className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResaleMarketPage;
