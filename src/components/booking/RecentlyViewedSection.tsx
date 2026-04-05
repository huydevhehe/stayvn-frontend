import { Star, MapPin } from "lucide-react";
import roomImg1 from "@/assets/hotel-room-1.jpg";
import roomImg2 from "@/assets/hotel-room-2.jpg";
import roomMonthly from "@/assets/room-monthly-1.jpg";

const items = [
    { name: "Riverside Boutique Hotel", image: roomImg1, price: 980000, rating: 4.3, location: "Quận 4" },
    { name: "Green Living Apartment", image: roomMonthly, price: 4500000, rating: 4.5, location: "Quận 7", monthly: true },
    { name: "Sky Garden Premium", image: roomImg2, price: 1650000, rating: 4.4, location: "Quận 2" },
];

const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const RecentlyViewedSection = () => {
    return (
        <section className="space-y-5">
            <h2 className="text-xl font-bold text-foreground">Đã xem gần đây</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((h) => (
                    <div
                        key={h.name}
                        className="flex gap-3 p-3 rounded-2xl border bg-card hover:shadow-card transition-shadow cursor-pointer"
                    >
                        <img src={h.image} alt={h.name} className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex flex-col justify-between py-0.5 min-w-0">
                            <h3 className="font-semibold text-foreground text-sm truncate">{h.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-warning text-warning" />
                                <span>{h.rating}</span>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{h.location}</span>
                            </div>
                            <p className="text-sm font-bold text-primary">
                                {formatVND(h.price)}
                                <span className="text-xs font-normal text-muted-foreground"> / {h.monthly ? "tháng" : "đêm"}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewedSection;
