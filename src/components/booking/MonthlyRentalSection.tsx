// src/components/hotel/MonthlyRentalSection.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import roomImg from "@/assets/room-monthly-1.jpg";
import type { MonthlyRoom } from "@/types/admin";

interface MonthlyRentalSectionProps {
  monthlyRooms?: MonthlyRoom[];
  onSelectMonthlyRoom: (room: MonthlyRoom) => void;   // ← THÊM PROP NÀY
}

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const MonthlyRentalSection = ({ 
  monthlyRooms = [], 
  onSelectMonthlyRoom 
}: MonthlyRentalSectionProps) => {

  return (
    <section className="space-y-5" id="monthly">
      <h2 className="text-xl font-bold text-foreground">Phòng thuê tháng</h2>

      {monthlyRooms.length === 0 ? (
        <div className="rounded-xl border bg-card p-6 text-center text-muted-foreground shadow-card">
          Hiện tại không có phòng thuê tháng nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {monthlyRooms.map((room) => {
            const monthlyPrice = room.monthlyPrice || 0;
            const status = (room.status || "").toString().toUpperCase();
            const isAvailable = status === "AVAILABLE";

            return (
              <div
                key={room.id || Math.random()}
                className="rounded-2xl border bg-card shadow-card overflow-hidden hover:shadow-elevated transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={roomImg} 
                    alt={room.name} 
                    className="w-full h-40 object-cover" 
                  />
                  <Badge 
                    className={`absolute top-3 left-3 border-0 font-semibold ${
                      isAvailable 
                        ? "bg-success text-success-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isAvailable ? "Đang trống" : "Đã thuê"}
                  </Badge>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-foreground">{room.name}</h3>
                  
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    {room.area && (
                      <p>Diện tích: <span className="font-medium text-foreground">{room.area} m²</span></p>
                    )}
                    <p>Tiền cọc: <span className="font-medium text-foreground">{formatVND(room.deposit)}</span></p>
                    <p>{room.utilities}</p>
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t">
                    <div>
                      <p className="text-xl font-bold text-primary">{formatVND(monthlyPrice)}</p>
                      <p className="text-xs text-muted-foreground">/ tháng</p>
                    </div>

                    <Button 
                      className="rounded-xl" 
                      disabled={!isAvailable}
                      onClick={() => isAvailable && onSelectMonthlyRoom(room)}
                    >
                      {isAvailable ? "Thuê ngay" : "Hết phòng"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default MonthlyRentalSection;