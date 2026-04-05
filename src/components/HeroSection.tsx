import { 
    Search, MapPin, Star 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import amenityService from "@/api/amenityService";

const quickFilters = [
    { label: "Du lịch", icon: "✈️" },
    { label: "Công tác", icon: "💼" },
    { label: "Gia đình", icon: "👨‍👩‍👧" },
    { label: "Dài hạn", icon: "📅" },
];

const HeroSection = () => {
    const navigate = useNavigate();

    const [keyword, setKeyword] = useState("");
    const [selectedStar, setSelectedStar] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState(3000000);
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
    const [amenityList, setAmenityList] = useState<any[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(true);

    // Fetch amenities thật từ API
    useEffect(() => {
        const fetchAmenities = async () => {
            try {
                const data = await amenityService.getAmenities();
                setAmenityList(data);
            } catch (err) {
                console.error("Load amenities failed", err);
            } finally {
                setLoadingAmenities(false);
            }
        };
        fetchAmenities();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (keyword.trim()) params.set("q", keyword.trim());
        
        if (selectedStar !== null) {
            params.set("stars", selectedStar.toString());
        }

        if (maxPrice) params.set("maxPrice", maxPrice.toString());

        if (selectedAmenities.length > 0) {
            params.set("amenities", selectedAmenities.join(","));
        }

        navigate(`/search?${params.toString()}`);
    };

    const toggleStar = (star: number) => {
        setSelectedStar(prev => prev === star ? null : star);
    };

    const toggleAmenity = (id: number) => {
        setSelectedAmenities(prev =>
            prev.includes(id) 
                ? prev.filter(a => a !== id) 
                : [...prev, id]
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute top-20 -right-40 w-[600px] h-[600px] rounded-full bg-primary/[0.05] blur-3xl" />
            <div className="absolute -bottom-20 -left-40 w-[500px] h-[500px] rounded-full bg-accent/[0.06] blur-3xl" />

            <div className="relative section-padding py-20 lg:py-28">
                {/* Title */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-4">
                        Nền tảng đặt phòng #1 Việt Nam
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-foreground leading-[1.1] mb-5">
                        Tìm chỗ ở{" "}
                        <span className="hero-highlight relative inline-block">
                            hoàn hảo
                        </span>{" "}
                        cho bạn
                    </h1>
                    <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
                        Hàng ngàn khách sạn, homestay chất lượng với giá tốt nhất
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-4xl mx-auto mb-10">
                    <div className="bg-card rounded-[22px] shadow-2xl border border-border/50 p-2">
                        <div className="flex flex-col lg:flex-row items-center gap-2 bg-white rounded-[18px] p-2">
                            <div className="flex-1 flex items-center gap-4 px-6 py-4">
                                <MapPin className="w-6 h-6 text-primary" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Bạn muốn đến đâu? (Đà Nẵng, Nha Trang...)"
                                    className="flex-1 bg-transparent text-lg font-medium outline-none placeholder:text-muted-foreground"
                                />
                            </div>

                            <Button 
                                onClick={handleSearch}
                                className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-semibold text-base"
                            >
                                <Search className="mr-2 w-5 h-5" />
                                Tìm kiếm
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="max-w-4xl mx-auto">
                    {/* Sao - Chỉ chọn 1 */}
                    <div className="flex justify-center gap-3 mb-8">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button
                                key={star}
                                onClick={() => toggleStar(star)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                                    selectedStar === star
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {star} sao
                            </button>
                        ))}
                    </div>

                    {/* Khoảng giá */}
                    <div className="max-w-md mx-auto mb-8 px-4">
                        <div className="flex justify-between text-sm mb-3">
                            <span className="font-medium">Giá tối đa</span>
                            <span className="font-semibold text-primary">
                                {maxPrice.toLocaleString()} ₫
                            </span>
                        </div>
                        <input
                            type="range"
                            min="500000"
                            max="5000000"
                            step="100000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>

                    {/* Tiện ích thật từ API */}
                    <div className="mb-12">
                        <h3 className="text-center text-sm font-medium text-muted-foreground mb-4">
                            Tiện ích phổ biến
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {amenityList.map((amenity) => (
                                <button
                                    key={amenity.id}
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`px-5 py-2.5 rounded-full text-sm border transition-all ${
                                        selectedAmenities.includes(amenity.id)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    {amenity.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Category Filters */}
                <div className="flex flex-wrap justify-center gap-3">
                    {quickFilters.map((f) => (
                        <button
                            key={f.label}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/80 backdrop-blur border border-white/60 hover:bg-white hover:border-primary text-sm font-medium transition-all"
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;