import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, ChevronRight, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import hotelDefault from "@/assets/hotel-1.jpg";
import favoriteService from "@/api/favoriteService";
import hotelService from "@/api/hotelService";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const FavoritesPage: React.FC = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        try {
            const hotels = await favoriteService.getFavoriteHotels();
            setFavorites(hotels);
        } catch (error) {
            console.error("Error loading favorites:", error);
            toast.error("Không thể tải danh sách yêu thích");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const handleRemoveFavorite = async (e: React.MouseEvent, hotelId: number, name: string) => {
        e.stopPropagation();
        try {
            await favoriteService.removeFavorite(hotelId);
            setFavorites(prev => prev.filter(h => h.id !== hotelId));
            toast.success(`Đã xóa ${name} khỏi danh sách yêu thích`);
        } catch (error) {
            toast.error("Không thể xóa khỏi danh sách yêu thích");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-slate-800">Danh sách yêu thích</h1>
                <p className="text-slate-400 font-medium">Lưu lại những nơi bạn muốn ghé thăm nhất</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-slate-400 font-bold">Đang tải danh sách...</p>
                    </div>
                ) : favorites.length === 0 ? (
                    <Card className="col-span-full border-dashed border-2 border-slate-200 shadow-none bg-slate-50/50 rounded-[2.5rem] p-16 text-center">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-10 h-10 text-rose-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">Chưa có khách sạn yêu thích</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Hãy thả tim cho những khách sạn bạn ưng ý để xem lại tại đây nhé.</p>
                        <Button 
                            onClick={() => navigate("/")}
                            className="mt-8 rounded-2xl px-8 h-12 font-black bg-primary text-white shadow-xl shadow-primary/20"
                        >
                            Khám phá ngay
                        </Button>
                    </Card>
                ) : (
                    favorites.map((hotel) => (
                        <Card 
                            key={hotel.id} 
                            onClick={() => navigate(`/hotel/${hotel.id}`)}
                            className="group overflow-hidden border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] hover:scale-[1.02] transition-all duration-500 cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={
                                        hotel.imageUrls?.[0] 
                                            ? (hotel.imageUrls[0].startsWith("http") 
                                                ? hotel.imageUrls[0] 
                                                : `${import.meta.env.VITE_API_URL}/${hotel.imageUrls[0]}`)
                                            : hotelDefault
                                    } 
                                    alt={hotel.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 font-bold" 
                                />
                                <div className="absolute top-4 right-4">
                                    <Button 
                                        size="icon" 
                                        variant="secondary" 
                                        onClick={(e) => handleRemoveFavorite(e, hotel.id, hotel.name)}
                                        className="rounded-2xl bg-white/80 backdrop-blur-md border-white/20 text-rose-500 shadow-lg hover:bg-white transition-all active:scale-90"
                                    >
                                        <Heart className="w-5 h-5 fill-current" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-black text-lg text-slate-800 truncate group-hover:text-primary transition-colors">{hotel.name}</h3>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="text-sm font-black">{hotel.starRating || 4.5}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">{hotel.address}</span>
                                </div>
                                <div className="pt-4 flex items-center justify-between border-t border-slate-50">
                                    <div className="flex items-baseline gap-1">
                                        <span className="font-black text-xl text-primary">{formatVND(hotel.minPrice || 0)}</span>
                                        <span className="text-[10px] text-slate-400 uppercase font-black">/ đêm</span>
                                    </div>
                                    <Button size="icon" variant="ghost" className="rounded-xl hover:bg-slate-50 text-slate-400">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;
