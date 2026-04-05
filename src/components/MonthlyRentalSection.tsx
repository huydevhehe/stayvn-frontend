import { Maximize2, Sofa, FileText, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import monthlyRentalService from "../api/monthlyRentalService";
import { Link } from "react-router-dom";
import { MonthlyRental } from "../types/admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80";

const MonthlyRentalSection = () => {
    const { data: rentals = [], isLoading } = useQuery({
        queryKey: ["monthly-rentals-home"],
        queryFn: () => monthlyRentalService.getAll(),
    });

    if (isLoading) {
        return (
            <div className="py-16 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Đang tải danh sách phòng trọ...</p>
            </div>
        );
    }

    if (rentals.length === 0) return null;

    return (
        <section className="py-16 lg:py-20 bg-secondary/50">
            <div className="section-padding">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Ở dài hạn — Thuê tháng</h2>
                        <p className="text-muted-foreground">Giải pháp lý tưởng cho sinh viên và người đi làm</p>
                    </div>
                    <Link to="/search?category=monthly" className="hidden sm:block text-sm font-semibold text-primary hover:underline">Xem tất cả →</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {rentals.map((item: MonthlyRental) => (
                        <Link
                            key={item.id}
                            to={`/monthly-rental/${item.id}`}
                            className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img 
                                    src={(() => {
                                        if (!item.imageUrls || item.imageUrls.length === 0) return DEFAULT_IMAGE;
                                        const firstUrl = item.imageUrls[0];
                                        if (firstUrl.startsWith('data:') || firstUrl.includes('placeholder')) return DEFAULT_IMAGE;
                                        return firstUrl.startsWith('http') ? firstUrl : `${API_URL}${firstUrl}`;
                                    })()} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm">Thuê tháng</span>
                                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                    <Heart className="w-4 h-4 text-foreground" />
                                </button>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-foreground mb-1 truncate">{item.name}</h3>
                                <p className="text-sm text-muted-foreground mb-3 truncate">{item.address}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                        <Maximize2 className="w-3 h-3" /> {item.area}m²
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                        <FileText className="w-3 h-3" /> Cọc {new Intl.NumberFormat('vi-VN').format(item.deposit)}₫
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-lg font-bold text-primary">
                                        {new Intl.NumberFormat('vi-VN').format(item.monthlyPrice)}₫
                                    </span>
                                    <span className="text-sm text-muted-foreground">/ tháng</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MonthlyRentalSection;
