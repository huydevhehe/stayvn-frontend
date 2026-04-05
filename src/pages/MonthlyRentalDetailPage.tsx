import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import monthlyRentalService from "../api/monthlyRentalService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
    Maximize2, MapPin, Zap, Droplets, Wifi, 
    FileText, Calendar, CheckCircle2, Share2, Heart,
    ChevronLeft, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import MonthlyBookingModal from "@/components/booking/MonthlyBookingModal";

const MonthlyRentalDetailPage = () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80";
    
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const { data: rental, isLoading, error } = useQuery({
        queryKey: ["monthly-rental-detail", id],
        queryFn: () => monthlyRentalService.getById(Number(id)),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !rental) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-xl font-semibold text-muted-foreground">Không tìm thấy thông tin phòng trọ</p>
                <Button onClick={() => navigate("/")}>Quay về trang chủ</Button>
            </div>
        );
    }

    const formatCurrency = (amount: number | undefined) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
                {/* Back Button & Actions */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2">
                        <ChevronLeft className="w-4 h-4" /> Quay lại
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Header Info */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 border-none">
                            Phòng trọ cao cấp
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                            {rental.status === "AVAILABLE" ? "Còn trống" : "Đã thuê"}
                        </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{rental.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-lg">{rental.address}</span>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Gallery */}
                        <div className="grid grid-cols-2 gap-4 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="col-span-2 sm:col-span-1 aspect-[4/3] bg-muted">
                                <img 
                                    src={(() => {
                                        if (!rental.imageUrls || rental.imageUrls.length === 0) return DEFAULT_IMAGE;
                                        const firstUrl = rental.imageUrls[0];
                                        if (firstUrl.startsWith('data:') || firstUrl.includes('placeholder')) return DEFAULT_IMAGE;
                                        return firstUrl.startsWith('http') ? firstUrl : `${API_URL}${firstUrl}`;
                                    })()} 
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                                    alt={rental.name} 
                                />
                            </div>
                            <div className="hidden sm:grid grid-rows-2 gap-4">
                                <div className="bg-muted overflow-hidden">
                                    <img 
                                        src={(() => {
                                            if (!rental.imageUrls || rental.imageUrls.length <= 1) return DEFAULT_IMAGE;
                                            const secUrl = rental.imageUrls[1];
                                            if (secUrl.startsWith('data:') || secUrl.includes('placeholder')) return DEFAULT_IMAGE;
                                            return secUrl.startsWith('http') ? secUrl : `${API_URL}${secUrl}`;
                                        })()} 
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                                        alt={rental.name} 
                                    />
                                </div>
                                <div className="bg-muted overflow-hidden relative">
                                    <img 
                                        src={(() => {
                                            if (!rental.imageUrls || rental.imageUrls.length <= 2) return DEFAULT_IMAGE;
                                            const thirdUrl = rental.imageUrls[2];
                                            if (thirdUrl.startsWith('data:') || thirdUrl.includes('placeholder')) return DEFAULT_IMAGE;
                                            return thirdUrl.startsWith('http') ? thirdUrl : `${API_URL}${thirdUrl}`;
                                        })()} 
                                        className="w-full h-full object-cover blur-[2px] opacity-60" 
                                        alt={rental.name} 
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button variant="secondary" className="rounded-full shadow-lg font-bold">
                                            +{rental.imageUrls?.length || 0} Ảnh
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 bg-card rounded-3xl card-shadow border border-slate-100">
                            <div className="text-center space-y-1">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Maximize2 className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Diện tích</p>
                                <p className="font-bold text-lg">{rental.area}m²</p>
                            </div>
                            <div className="text-center space-y-1 border-l">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                </div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tối thiểu</p>
                                <p className="font-bold text-lg">{rental.minContractMonths} tháng</p>
                            </div>
                            <div className="text-center space-y-1 border-l">
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                </div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Trạng thái</p>
                                <p className="font-bold text-lg text-green-600">Sẵn sàng</p>
                            </div>
                            <div className="text-center space-y-1 border-l">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Info className="w-5 h-5 text-amber-500" />
                                </div>
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Tiện ích</p>
                                <p className="font-bold text-lg">Đầy đủ</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Mô tả chi tiết
                            </h2>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                                {rental.description || "Chưa có mô tả chi tiết cho căn trọ này."}
                            </div>
                        </div>

                        <Separator className="my-10" />

                        {/* Contract Terms */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Điều khoản & Tiện ích
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-secondary/30 rounded-2xl space-y-4">
                                    <h3 className="font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Quy định hợp đồng</h3>
                                    <p className="text-sm text-muted-foreground leading-loose">{rental.terms || "Theo quy định chung của StayVN"}</p>
                                </div>
                                <div className="p-6 bg-secondary/30 rounded-2xl space-y-4">
                                    <h3 className="font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Tiện nghi đi kèm</h3>
                                    <p className="text-sm text-muted-foreground leading-loose">{rental.utilities || "Điện nước wifi đầy đủ"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-card rounded-3xl p-8 card-shadow shadow-primary/5 border border-primary/10 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                                
                                <div className="relative space-y-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1 uppercase font-bold tracking-widest">Giá thuê hằng tháng</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-primary">{formatCurrency(rental.monthlyPrice)}</span>
                                            <span className="text-muted-foreground font-medium">/ tháng</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-muted-foreground"><Zap className="w-4 h-4" /> Tiền điện</span>
                                            <span className="font-bold">{formatCurrency(rental.electricityPrice)} <span className="text-[10px] text-muted-foreground font-normal">/kWh</span></span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-muted-foreground"><Droplets className="w-4 h-4" /> Tiền nước</span>
                                            <span className="font-bold">{formatCurrency(rental.waterPrice)} <span className="text-[10px] text-muted-foreground font-normal">/m³</span></span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-muted-foreground"><Wifi className="w-4 h-4" /> Phí Wifi</span>
                                            <span className="font-bold">{formatCurrency(rental.wifiPrice)} <span className="text-[10px] text-muted-foreground font-normal">/tháng</span></span>
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="flex items-center gap-2 text-foreground font-bold italic"><Info className="w-4 h-4 text-primary" /> Tiền đặt cọc</span>
                                            <span className="font-black text-primary text-xl">{formatCurrency(rental.deposit)}</span>
                                        </div>
                                    </div>

                                    <Button 
                                        className="w-full py-8 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        onClick={() => setIsBookingModalOpen(true)}
                                    >
                                        ĐẶT THUÊ NGAY
                                    </Button>
                                    
                                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                        Thanh toán cọc bảo đảm an toàn 100%
                                    </p>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-4 border border-primary/10">
                                <div className="p-2 bg-primary rounded-xl">
                                    <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Xác thực bởi StayVN</p>
                                    <p className="text-xs text-muted-foreground">Thông tin phòng trọ hoàn toàn chính xác</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <MonthlyBookingModal 
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                rental={rental}
            />

            <Footer />
        </div>
    );
};

export default MonthlyRentalDetailPage;
