// src/components/hotel/RoomTypesSection.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Maximize, Users, Bed, RefreshCw } from "lucide-react";
import React, { useEffect, useRef } from "react";
import type { RoomType } from "@/types/hotel";
import type { Room } from "@/types/admin";

interface RoomTypesSectionProps {
  hotelId?: string;
  roomTypes: RoomType[];
  rooms: Room[];
  onSelectRoom: (room: Room) => void;        // ← THÊM PROP NÀY
}

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

// --- TÍCH HỢP TRỰC TIẾP PANORAMA VIEWER ---
interface PanoramaViewerProps {
  imageUrl: string;
}

const PanoramaViewer = ({ imageUrl }: PanoramaViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).pannellum && viewerRef.current) {
        (window as any).pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: -2,
          showControls: true,
          mouseZoom: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [imageUrl]);

  return (
    <div ref={viewerRef} className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-bold">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="animate-pulse opacity-50 tracking-widest uppercase text-xs">Đang tải không gian 360°...</p>
      </div>
    </div>
  );
};
// ------------------------------------------

const RoomTypesSection = ({ 
  hotelId, 
  roomTypes = [], 
  rooms = [], 
  onSelectRoom 
}: RoomTypesSectionProps) => {
  const [selected360Image, setSelected360Image] = React.useState<string | null>(null);

  if (roomTypes.length === 0) {
    return (
      <section className="space-y-5" id="rooms">
        <h2 className="text-xl font-bold text-foreground">Loại phòng khách sạn</h2>
        <div className="p-8 text-center border rounded-2xl bg-card">
          <p className="text-muted-foreground">Khách sạn này hiện chưa có loại phòng nào.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5" id="rooms">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Loại phòng khách sạn</h2>
        {hotelId && (
          <span className="text-[10px] text-muted-foreground uppercase opacity-50">
            Ref: {hotelId}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {roomTypes.map((type) => {
          const price = type.pricePerNight || 0;
          const roomsOfType = rooms.filter(r => r.roomTypeId === type.id);
          const availableRooms = roomsOfType.filter(r => r.status?.toUpperCase() === "AVAILABLE");
          const availableCount = availableRooms.length;
          const roomInstance = availableRooms[0] || roomsOfType[0];

          const rawImage = type.imageUrl || (type.images && type.images.length > 0 ? type.images[0].imageUrl : null);
          const imageSrc = rawImage 
            ? (rawImage.startsWith("http") ? rawImage : `http://localhost:8080${rawImage.startsWith("/") ? "" : "/"}${rawImage}`)
            : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800&auto=format&fit=crop";

          const image360 = type.images?.find(img => img.is360)?.imageUrl;
          const image360Src = image360 
            ? (image360.startsWith("http") ? image360 : `http://localhost:8080${image360.startsWith("/") ? "" : "/"}${image360}`)
            : "https://pannellum.org/images/alma.jpg";

          return (
            <div
              key={type.id}
              className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="relative overflow-hidden rounded-xl w-full md:w-56 h-40 flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={type.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {image360Src && (
                  <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelected360Image(image360Src)}
                        className="rounded-xl font-bold gap-2 animate-in zoom-in duration-300"
                      >
                        <Maximize className="w-4 h-4" /> Xem 360°
                      </Button>
                    </div>
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-purple-600/90 backdrop-blur-md text-white border-none text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3" /> 360° VR
                      </Badge>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground text-lg">{type.name}</h3>
                    {availableCount > 0 && availableCount <= 2 && (
                      <Badge className="bg-destructive/10 text-destructive border-0 text-xs font-bold animate-pulse">
                        Chỉ còn {availableCount} phòng
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      {type.capacity} khách
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4" />
                      {type.bedType || "Chưa cập nhật"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-4 w-4" />
                      Theo chính sách khách sạn
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between border-t pt-3 md:border-t-0 md:pt-0">
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatVND(price)}</p>
                    <p className="text-xs text-muted-foreground">/ đêm (đã bao gồm thuế)</p>
                  </div>

                  <Button
                    disabled={roomsOfType.length === 0}
                    className="rounded-xl px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    onClick={() => roomInstance && onSelectRoom(roomInstance)}
                  >
                    Chọn phòng
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panorama Viewer Modal */}
      {selected360Image && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="relative w-full max-w-6xl aspect-video bg-white/5 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <Button 
              size="icon"
              variant="ghost"
              onClick={() => setSelected360Image(null)}
              className="absolute top-6 right-6 z-10 text-white hover:bg-white/20 rounded-full"
            >
              <RefreshCw className="w-6 h-6 rotate-45" />
            </Button>
            <PanoramaViewer imageUrl={selected360Image} />
          </div>
        </div>
      )}
    </section>
  );
};

export default RoomTypesSection;