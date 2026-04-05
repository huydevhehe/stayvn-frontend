import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Nguyễn Minh Anh",
        avatar: "MA",
        rating: 5,
        review: "Trải nghiệm tuyệt vời! Đặt phòng dễ dàng, giá rẻ hơn nhiều so với các nền tảng khác. Phòng sạch sẽ, đúng mô tả.",
        location: "TP.HCM",
    },
    {
        name: "Trần Đức Huy",
        avatar: "DH",
        rating: 5,
        review: "Thuê trọ tháng qua StayVN rất tiện. Hợp đồng rõ ràng, chủ nhà thân thiện, hỗ trợ nhanh chóng khi cần.",
        location: "Hà Nội",
    },
    {
        name: "Lê Thị Phương",
        avatar: "TP",
        rating: 4,
        review: "Đi du lịch Đà Nẵng cùng gia đình, book homestay trên StayVN rất ưng ý. View đẹp, chủ nhà nhiệt tình.",
        location: "Đà Nẵng",
    },
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 lg:py-20 bg-secondary/50">
            <div className="section-padding">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Khách hàng nói gì?</h2>
                    <p className="text-muted-foreground">Hàng nghìn đánh giá tích cực từ cộng đồng</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t) => (
                        <div key={t.name} className="bg-card rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-all duration-300">
                            <div className="flex gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < t.rating ? "fill-warning text-warning" : "text-border"}`} />
                                ))}
                            </div>
                            <p className="text-foreground text-sm leading-relaxed mb-4">"{t.review}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
