import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import hotelDefault from "../assets/hotel-1.jpg";
import favoriteService from "../api/favoriteService";
import { useAuth } from "../auth/useAuth";
import { toast } from "sonner";

interface HotelCardProps {
  hotel: any;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const [fav, setFav] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFav = async () => {
      if (user && hotel.id) {
        const isFav = await favoriteService.isFavorite(hotel.id);
        setFav(isFav);
      }
    };
    checkFav();
  }, [user, hotel.id]);

  const handleToggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    try {
      const newStatus = await favoriteService.toggleFavorite(hotel.id, fav);
      setFav(newStatus);
      toast.success(newStatus ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  // Xử lý hình ảnh
  const rawImage = hotel.imageUrls?.[0] || hotel.image;
  const image = rawImage 
    ? (rawImage.startsWith("http") ? rawImage : `${import.meta.env.VITE_API_URL}/${rawImage}`)
    : hotelDefault;

  // Xử lý hiển thị rating giống RecommendedSection
  let displayRating = 0;
  if (hotel.averageRating != null && hotel.averageRating > 0) {
    displayRating = Number(hotel.averageRating.toFixed(1));
  } else {
    displayRating = hotel.starRating || 0;
  }

  // Xử lý giá
  const priceDisplay = hotel.minPrice 
    ? hotel.minPrice.toLocaleString("vi-VN") 
    : "0";

  return (
    <Link
      to={`/hotel/${hotel.id}`}
      className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 block"
    >
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground">
          Khách sạn
        </span>

        {/* Heart Button - cải tiến giống Recommended */}
        <button
          onClick={handleToggleFav}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              fav ? "fill-primary text-primary" : "text-foreground"
            }`}
          />
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 fill-warning text-warning" />
          <span className="text-xl font-bold text-foreground">
            {displayRating}
          </span>
          <span className="text-sm text-muted-foreground ml-1">
            ({hotel.reviewCount || 0} đánh giá)
          </span>
        </div>

        {/* Name */}
        <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {hotel.name}
        </h3>

        {/* Address */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {hotel.address}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">
            {priceDisplay}₫
          </span>
          <span className="text-sm text-muted-foreground">/ đêm</span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;