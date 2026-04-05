import { Star, Palmtree, Home, Building2, DoorOpen, Castle, MapPin, BadgePercent } from "lucide-react";
import AISearchBar from "@/modules/search/components/AISearchBar";
const categories = [
    { icon: Star, label: "Khách sạn 5 sao", color: "text-warning" },
    { icon: Palmtree, label: "Resort", color: "text-success" },
    { icon: Home, label: "Homestay", color: "text-primary" },
    { icon: Building2, label: "Căn hộ", color: "text-accent-foreground" },
    { icon: DoorOpen, label: "Nhà trọ thuê tháng", color: "text-primary" },
    { icon: Castle, label: "Villa", color: "text-success" },
    { icon: MapPin, label: "Gần trung tâm", color: "text-warning" },
    { icon: BadgePercent, label: "Giá tốt", color: "text-destructive" },
];

const CategoriesSection = () => {
    return (
        <section className="py-16 lg:py-20">
            <div className="section-padding">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Danh mục phổ biến</h2>
                    <p className="text-muted-foreground">Khám phá chỗ ở theo sở thích của bạn</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-card card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-accent transition-colors">
                                <cat.icon className={`w-6 h-6 ${cat.color}`} />
                            </div>
                            <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.label}</span>
                        </button>
                    ))}
                </div>
                <AISearchBar />
            </div>
        </section>
    );
};

export default CategoriesSection;
