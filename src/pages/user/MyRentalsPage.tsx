import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import monthlyBookingService from "../../api/monthlyBookingService";
import { useAuth } from "../../auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/Modal";
import { FileText, Calendar, Home, MapPin, Search } from "lucide-react";
import { MonthlyBooking } from "../../types/admin";
import { format } from "date-fns";

const MyRentalsPage: React.FC = () => {
    const { user } = useAuth();
    const [selectedBooking, setSelectedBooking] = useState<MonthlyBooking | null>(null);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);

    // ===================== QUERIES =====================
    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ["user-monthly-bookings", user?.id],
        queryFn: () => user ? monthlyBookingService.getByUser(user.id) : Promise.resolve([]),
        enabled: !!user,
    });

    if (isLoading) {
        return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight">Trọ của tôi 🏠</h2>
                <p className="text-muted-foreground">Theo dõi hợp đồng đặt cọc và danh sách phòng trọ bạn đang thuê.</p>
            </div>

            {bookings.length === 0 ? (
                <Card className="border-dashed py-20">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <div className="p-4 rounded-full bg-slate-100">
                            <Search className="w-10 h-10 text-slate-400" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-900">Bạn chưa có đơn thuê trọ nào</p>
                            <p className="text-sm text-slate-500">Hãy khám phá các căn trọ tuyệt vời trên StayVN!</p>
                        </div>
                        <Button asChild className="rounded-full px-8">
                            <a href="/search?category=monthly">Tìm trọ ngay</a>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking: MonthlyBooking) => (
                        <Card key={booking.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white shadow-sm ring-1 ring-slate-200">
                            <div className="h-3 bg-primary" />
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-primary/5 text-primary">
                                        <Home className="w-5 h-5" />
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                        booking.status === 'CONFIRMED' || booking.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <CardTitle className="mt-4 text-xl line-clamp-1">{booking.rentalName}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {booking.address}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Ngày bắt đầu</p>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            {format(new Date(booking.startDate), "dd/MM/yyyy")}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Thời hạn</p>
                                        <p className="font-semibold">{booking.contractMonths} tháng</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Giá thuê tháng:</span>
                                        <span className="font-bold text-slate-900">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(booking.monthlyPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tiền đặt cọc:</span>
                                        <span className="font-bold text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(booking.depositAmount)}</span>
                                    </div>
                                </div>

                                <Button 
                                    className="w-full gap-2 rounded-xl h-12 shadow-md hover:shadow-lg transition-all"
                                    onClick={() => {
                                        setSelectedBooking(booking);
                                        setIsContractModalOpen(true);
                                    }}
                                >
                                    <FileText className="w-4 h-4" /> Xem hợp đồng điện tử
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Contract Modal */}
            <Modal
                isOpen={isContractModalOpen}
                onClose={() => setIsContractModalOpen(false)}
                title="Hợp đồng điện tử / Xác nhận đặt cọc"
            >
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300 font-mono text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto shadow-inner">
                    {selectedBooking?.contractContent || "Đang tải nội dung hợp đồng..."}
                </div>
                <div className="mt-6 flex flex-col gap-3">
                    <p className="text-xs text-center text-muted-foreground italic">
                        * Bản hợp đồng này có giá trị pháp lý điện tử để xác nhận việc đặt cọc thuê phòng tại StayVN.
                    </p>
                    <Button onClick={() => window.print()} variant="outline" className="gap-2 rounded-xl h-12 border-2">
                        <FileText className="w-4 h-4" /> Lưu về máy (PDF)
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default MyRentalsPage;
