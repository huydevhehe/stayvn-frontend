import { Badge } from "@/components/ui/badge";
import type { Hotel } from "@/types/admin";
import {
  Wifi, Wind, Car, Waves, Coffee, Dumbbell, ShieldCheck, Utensils,
  Tv, Bath, Refrigerator, Lock, Flame, Fan, Heater, KeyRound, UtensilsCrossed,
  WashingMachine,
} from "lucide-react";

interface OverviewSectionProps {
  data: Hotel;
}

// Map icon theo tên amenity
const iconMap: Record<string, React.ComponentType<any>> = {
  "WiFi miễn phí": Wifi,
  "Wifi miễn phí": Wifi,
  "Máy lạnh": Wind,
  "Bãi đỗ xe": Car,
  "Bãi xe": Car,
  "Hồ bơi": Waves,
  "Hồ bơi vô cực": Waves,
  "Phòng gym": Dumbbell,
  "Gym": Dumbbell,
  "Quầy bar": Coffee,
  "Quầy bar/Cafe": Coffee,
  "Cafe": Coffee,
  "Nhà hàng": Utensils,
  "Restaurant": UtensilsCrossed,
  "An ninh 24/7": ShieldCheck,
  "Bảo vệ 24/7": ShieldCheck,
  "TV màn hình phẳng": Tv,
  "Máy giặt": WashingMachine,
  "Bồn tắm": Bath,
  "Tủ lạnh": Refrigerator,
  "Bếp nấu": Flame,
  "Khóa điện tử": Lock,
  "Quạt trần": Fan,
  "Máy sấy tóc": Heater,
};

const OverviewSection = ({ data }: OverviewSectionProps) => {
  // Chuẩn hóa amenities từ database (hỗ trợ cả mảng string và mảng object)
  const rawAmenities = data.amenities || [];

  const amenityNames = rawAmenities.map(item =>
    typeof item === "string" ? item : (item as any)?.name || ""
  ).filter(Boolean);

  // Nếu không có data thật thì dùng fallback
  const finalAmenities = amenityNames.length > 0 
    ? amenityNames 
    : ["WiFi miễn phí", "Máy lạnh", "Bãi đỗ xe", "Hồ bơi", "Phòng gym", "Nhà hàng"];

  // Tạo danh sách để render
  const displayedAmenities = finalAmenities.map((name) => {
    const Icon = iconMap[name] || ShieldCheck;
    return { icon: Icon, label: name };
  });

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary font-semibold px-3 py-1">
            Hotel
          </Badge>
          <Badge variant="outline" className="border-accent-foreground text-accent-foreground font-semibold px-3 py-1">
            Cho thuê tháng
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground italic">
          Đang xem thông tin chi tiết của: <strong>{data.name}</strong>
        </p>
      </div>

      <p className="text-muted-foreground leading-relaxed">
        {data.description || "Khách sạn này nổi bật với vị trí đắc địa, tiện nghi hiện đại và dịch vụ tận tâm, mang đến trải nghiệm lưu trú đáng nhớ."}
      </p>

      {/* Tiện ích nổi bật - LẤY TỪ DATABASE */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Tiện ích nổi bật</h3>
        <div className="flex flex-wrap gap-3">
          {displayedAmenities.slice(0, 8).map(({ icon: Icon, label }, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary 
                         text-secondary-foreground text-sm font-medium 
                         transition-colors hover:bg-primary/10"
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;