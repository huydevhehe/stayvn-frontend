import { useState } from "react";
import { Heart, Share2, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import favoriteService from "@/api/favoriteService";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";

import heroImg1 from "@/assets/hotel-hero-1.jpg";
import heroImg2 from "@/assets/hotel-hero-2.jpg";
import heroImg3 from "@/assets/hotel-hero-3.jpg";

interface HeroGalleryProps {
  hotelId?: string;
  images?: string[];
  name?: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
}

const fallbackImages = [heroImg1, heroImg2, heroImg3];

const HeroGallery = ({
  hotelId,
  images = [],
  name,
  address,
  rating = 4.8,
  reviewCount = 0
}: HeroGalleryProps) => {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && hotelId) {
      favoriteService.isFavorite(Number(hotelId)).then(setLiked);
    }
  }, [user, hotelId]);

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để sử dụng tính năng yêu thích");
      return;
    }

    try {
      const newStatus = await favoriteService.toggleFavorite(Number(hotelId), liked);
      setLiked(newStatus);
      toast.success(newStatus ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };

  // 👉 Normalize images (fix backend URL lỗi)
  const displayImages =
    images && images.length > 0
      ? images.map((img) =>
          img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL}/${img}`
        )
      : fallbackImages;

  const hotelName = name || `StayVN Hotel #${hotelId || ""}`;

  const next = () => setCurrent((c) => (c + 1) % displayImages.length);
  const prev = () => setCurrent((c) => (c - 1 + displayImages.length) % displayImages.length);

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl aspect-[16/9] max-h-[520px] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={displayImages[current]}
            alt="Hotel"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImages[0];
            }}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition">
          <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/90" onClick={prev}>
            <ChevronLeft />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/90" onClick={next}>
            <ChevronRight />
          </Button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/90" onClick={handleToggleLike}>
            <Heart className={liked ? "fill-red-500 text-red-500" : ""} />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full h-10 w-10 bg-white/90">
            <Share2 />
          </Button>
        </div>

        <div className="absolute top-4 left-4">
          <Badge className="bg-green-500 text-white">Còn phòng</Badge>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full px-3 py-1 text-xs">
          {current + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto">
        {displayImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-24 h-16 rounded-xl overflow-hidden border-2 ${
              i === current ? "border-primary" : "opacity-60"
            }`}
          >
            <img
              src={img}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImages[0];
              }}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold">{hotelName}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-bold">{rating}</span>
            <span>({reviewCount} đánh giá)</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{address || "Chưa cập nhật địa chỉ"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroGallery;