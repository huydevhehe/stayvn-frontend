import cityHCM from "../assets/city-hcm.jpg";
import cityHanoi from "../assets/city-hanoi.jpg";
import cityDanang from "../assets/city-danang.jpg";
import cityNhatrang from "../assets/city-nhatrang.jpg";
import cityDalat from "../assets/city-dalat.jpg";

const destinations = [
    { name: "TP. Hồ Chí Minh", count: "320+ chỗ ở", image: cityHCM },
    { name: "Hà Nội", count: "280+ chỗ ở", image: cityHanoi },
    { name: "Đà Nẵng", count: "190+ chỗ ở", image: cityDanang },
    { name: "Nha Trang", count: "150+ chỗ ở", image: cityNhatrang },
    { name: "Đà Lạt", count: "120+ chỗ ở", image: cityDalat },
];

const DestinationsSection = () => {
    return (
        <section className="py-16 lg:py-20 bg-secondary/50">
            <div className="section-padding">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Địa điểm phổ biến</h2>
                    <p className="text-muted-foreground">Những thành phố được yêu thích nhất</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {destinations.map((dest, i) => (
                        <div
                            key={dest.name}
                            className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 ? "col-span-2 lg:col-span-2 row-span-2 aspect-square" : "aspect-[3/4]"
                                }`}
                        >
                            <img
                                src={dest.image}
                                alt={dest.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                                <h3 className="text-lg lg:text-xl font-bold text-primary-foreground">{dest.name}</h3>
                                <p className="text-sm text-primary-foreground/80">{dest.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DestinationsSection;
