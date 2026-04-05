import { useQuery } from "@tanstack/react-query";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import hotelService from "@/api/hotelService";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

interface SimilarHotel {
  id: number;
  name: string;
  imageUrl?: string;
  minPrice?: number;
  averageRating?: number;
  address?: string;
  availableRooms?: number;
  commonAmenitiesCount?: number;
}

interface SimilarSectionProps {
  currentHotelId?: number | string;
}

const SimilarSection = ({ currentHotelId }: SimilarSectionProps) => {
  const { data: similar = [], isLoading } = useQuery({
    queryKey: ["similarHotels", currentHotelId],
    queryFn: () => hotelService.getSimilarHotels(Number(currentHotelId)),
    enabled: !!currentHotelId,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-foreground">Khách sạn tương tự</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      </section>
    );
  }

  if (similar.length === 0) {
    return (
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-foreground">Khách sạn tương tự</h2>
        <p className="text-muted-foreground">Không tìm thấy khách sạn tương tự phù hợp.</p>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Khách sạn tương tự</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {similar.map((h: SimilarHotel) => {
          const price = h.minPrice || 0;
          const rating = h.averageRating?.toFixed(1) || "4.5";
          const location = h.address?.split(",").pop()?.trim() || "TP. Hồ Chí Minh";

          return (
            <div
              key={h.id}
              className="rounded-2xl border bg-card shadow-card overflow-hidden hover:shadow-elevated transition-shadow cursor-pointer group"
              onClick={() => (window.location.href = `/hotel/${h.id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={h.imageUrl || "/assets/hotel-default.jpg"}
                  alt={h.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {h.availableRooms && h.availableRooms <= 2 && (
                  <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground border-0 text-xs font-semibold">
                    Chỉ còn {h.availableRooms} phòng
                  </Badge>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-foreground truncate">{h.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                  <span className="font-medium text-foreground">{rating}</span>
                  <span>•</span>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{location}</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  {formatVND(price)} <span className="text-xs font-normal text-muted-foreground">/ đêm</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SimilarSection;