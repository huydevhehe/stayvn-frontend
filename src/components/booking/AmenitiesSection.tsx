import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Wifi, Wind, Car, Waves, Coffee, Dumbbell, ShieldCheck, Utensils,
  Tv, WashingMachine, Bath, Refrigerator, Lock, Flame, Fan, Heater,
  KeyRound, UtensilsCrossed,
} from "lucide-react";

interface AmenitiesSectionProps {
  amenities?: Array<{ id?: number; name: string; icon?: string } | string>; // hỗ trợ cả 2 dạng
}

const iconMap: Record<string, React.ComponentType<any>> = {
  "WiFi miễn phí": Wifi,
  "Wifi miễn phí": Wifi,
  "Máy lạnh": Wind,
  "Bãi đỗ xe": Car,
  "Bãi xe": Car,
  "Hồ bơi": Waves,
  "Hồ bơi vô cực": Waves,
  "Pool": Waves,
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

const AmenitiesSection = ({ amenities = [] }: AmenitiesSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  // Chuẩn hóa amenities về dạng string tên
  const amenityNames = amenities.map(item => 
    typeof item === "string" ? item : item?.name || ""
  ).filter(Boolean);

  const hasRealData = amenityNames.length > 0;

  const realAmenityItems = amenityNames.map((name) => {
    const IconComponent = iconMap[name] || ShieldCheck;
    return { icon: IconComponent, label: name };
  });

  const groups = hasRealData
    ? [{ title: "Tiện ích khách sạn", items: realAmenityItems }]
    : [
        {
          title: "Chung",
          items: [
            { icon: Wifi, label: "Wifi miễn phí" },
            { icon: Car, label: "Bãi đỗ xe" },
            { icon: Waves, label: "Hồ bơi" },
            { icon: Dumbbell, label: "Phòng gym" },
            { icon: Coffee, label: "Quầy bar/Cafe" },
            { icon: Utensils, label: "Nhà hàng" },
          ],
        },
        {
          title: "Phòng ngủ",
          items: [
            { icon: Wind, label: "Máy lạnh" },
            { icon: Tv, label: "TV màn hình phẳng" },
            { icon: Fan, label: "Quạt trần" },
            { icon: Heater, label: "Máy sấy tóc" },
          ],
        },
      ];

  const displayed = showAll ? groups : groups.slice(0, hasRealData ? 1 : 2);

  return (
    <section className="space-y-5" id="amenities">
      <h2 className="text-xl font-bold text-foreground">Tiện ích chi tiết</h2>

      <div className="space-y-6">
        {displayed.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h3 className="font-semibold text-foreground mb-3">{group.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary text-sm text-secondary-foreground hover:bg-primary/10 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!showAll && groups.length > (hasRealData ? 1 : 2) && (
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setShowAll(true)}
        >
          Xem thêm tiện ích
        </Button>
      )}
    </section>
  );
};

export default AmenitiesSection;