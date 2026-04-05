import { Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import hotelDefault from "../assets/hotel-1.jpg";

import hotelService from "@/api/hotelService";
import favoriteService from "@/api/favoriteService";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";

interface Hotel {
  id: number;
  name: string;
  address: string;
  starRating: number;
  averageRating?: number | null;
  reviewCount?: number;
  minPrice?: number;
  imageUrls?: string[];
}

const RecommendedSection = () => {
  const navigate = useNavigate();

   const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await hotelService.getHotels();

        // ================== LỌC CHỈ KHÁCH SẠN CÓ GIÁ ==================
        const filteredData = data.filter((hotel: Hotel) => 
          hotel.minPrice !== null && 
          hotel.minPrice !== undefined && 
          hotel.minPrice > 0
        );

        const formattedListings = filteredData.map((hotel: Hotel) => {
          let displayRating = 0;

          if (hotel.averageRating != null && hotel.averageRating > 0) {
            displayRating = Number(hotel.averageRating.toFixed(1));
          } else {
            displayRating = hotel.starRating || 0;
          }

          const rawImage = hotel.imageUrls?.[0];
          const displayImage = rawImage 
            ? (rawImage.startsWith("http") ? rawImage : `${import.meta.env.VITE_API_URL}/${rawImage}`)
            : hotelDefault;

          return {
            id: hotel.id,
            image: displayImage,
            badge: "Khách sạn",
            name: hotel.name,
            address: hotel.address,
            rating: displayRating,
            reviews: hotel.reviewCount || 0,
            price: hotel.minPrice!.toLocaleString("vi-VN"),   // Đã chắc chắn có giá
            unit: "đêm"
          };
        });

        setListings(formattedListings);
      } catch (err: any) {
        console.error("Fetch hotels error:", err);
        setError(err.response?.data?.message || err.message || "Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Tải danh sách yêu thích khi user đăng nhập
  useEffect(() => {
    if (user) {
      favoriteService.getFavoriteHotels().then((hotels) => {
        setFavorites(new Set(hotels.map(h => h.id)));
      });
    } else {
      setFavorites(new Set());
    }
  }, [user]);

  const toggleFav = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    const isFav = favorites.has(id);
    try {
      const newStatus = await favoriteService.toggleFavorite(id, isFav);
      setFavorites((prev) => {
        const next = new Set(prev);
        newStatus ? next.add(id) : next.delete(id);
        return next;
      });
      toast.success(newStatus ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  const handleViewAll = () => {
    navigate("/search");
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-20">
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Đang tải khách sạn nổi bật...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-20">
        <div className="section-padding text-center text-red-500">
          <p>Không thể tải dữ liệu: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  // Nếu sau khi lọc không còn khách sạn nào
  if (listings.length === 0) {
    return (
      <section className="py-16 lg:py-20">
        <div className="section-padding text-center">
          <p className="text-muted-foreground">Hiện tại chưa có khách sạn nổi bật nào có giá.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="section-padding">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Nổi bật hôm nay
            </h2>
            <p className="text-muted-foreground">
              Được khách hàng đánh giá cao
            </p>
          </div>

          <button 
            onClick={handleViewAll}
            className="hidden sm:block text-sm font-semibold text-primary hover:underline transition-colors"
          >
            Xem tất cả →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Link
              to={`/hotel/${item.id}`}
              key={item.id}
              className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground">
                  {item.badge}
                </span>

                <button
                  onClick={(e) => toggleFav(e, item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${favorites.has(item.id) ? "fill-primary text-primary" : "text-foreground"}`}
                  />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="text-xl font-bold text-foreground">
                    {item.rating}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({item.reviews} đánh giá)
                  </span>
                </div>

                <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.address}
                </p>

                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-primary">
                    {item.price}₫
                  </span>
                  <span className="text-sm text-muted-foreground">/ {item.unit}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedSection;