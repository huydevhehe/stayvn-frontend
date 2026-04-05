import { MapPin, Plane, Building2, UtensilsCrossed } from "lucide-react";

// 1. Định nghĩa Interface cho Props
interface MapSectionProps {
    address?: string;
}

const nearby = [
    { icon: Plane, name: "Sân bay Tân Sơn Nhất", distance: "8.5 km" },
    { icon: Building2, name: "Trung tâm Q.1 (Bến Thành)", distance: "3.2 km" },
    { icon: UtensilsCrossed, name: "Phố ẩm thực Vĩnh Khánh", distance: "1.5 km" },
    { icon: Building2, name: "Landmark 81", distance: "0.8 km" },
];

// 2. Nhận address từ props
const MapSection = ({ address }: MapSectionProps) => {

    // Tạo link nhúng Google Maps dựa trên địa chỉ truyền vào
    // Lưu ý: Sau này bạn có thể truyền tọa độ lat/lng để chính xác hơn
    const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address || "92 Nguyễn Hữu Cảnh, Bình Thạnh")}&output=embed`;

    return (
        <section className="space-y-6 scroll-mt-20" id="location">
            <h2 className="text-xl font-bold text-foreground">Vị trí & Giao thông</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Real Google Map Embed */}
                <div className="group relative rounded-2xl overflow-hidden border bg-muted aspect-video lg:aspect-square shadow-sm">
                    <iframe
                        title="Hotel Location"
                        src={mapSrc}
                        className="w-full h-full border-0 grayscale-[0.2] contrast-[1.1] hover:grayscale-0 transition-all duration-500"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    {/* Overlay khi hover để trông xịn hơn */}
                    <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-lg border flex items-center gap-2 pointer-events-none transition-transform group-hover:scale-105">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold">{address || "Đang xác định..."}</span>
                    </div>
                </div>

                {/* Nearby Places */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">Địa điểm lân cận</h3>
                        <span className="text-xs text-muted-foreground italic">* Khoảng cách ước tính</span>
                    </div>

                    <div className="grid gap-3">
                        {nearby.map(({ icon: Icon, name, distance }) => (
                            <div
                                key={name}
                                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 group"
                            >
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{name}</p>
                                    <p className="text-xs text-muted-foreground">Địa điểm du lịch/tiện ích</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-black text-primary">{distance}</span>
                                    <p className="text-[10px] text-muted-foreground">từ đây</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <strong>Mẹo di chuyển:</strong> Khu vực này rất dễ bắt Grab hoặc Taxi. Bạn có thể sử dụng tuyến Bus sông chỉ cách đây 500m.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MapSection;