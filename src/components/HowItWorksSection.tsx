import { Search, CalendarCheck, CreditCard } from "lucide-react";

const steps = [
    { icon: Search, step: "01", title: "Tìm kiếm", desc: "Nhập địa điểm, ngày, loại hình phòng bạn muốn." },
    { icon: CalendarCheck, step: "02", title: "Đặt phòng", desc: "Chọn chỗ ở ưng ý, xem chi tiết và đặt ngay." },
    { icon: CreditCard, step: "03", title: "Xác nhận & Thanh toán", desc: "Thanh toán an toàn, nhận xác nhận tức thì." },
];

const HowItWorksSection = () => {
    return (
        <section className="py-16 lg:py-20 bg-secondary/50">
            <div className="section-padding">
                <div className="text-center mb-12">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Cách hoạt động</h2>
                    <p className="text-muted-foreground">Chỉ 3 bước đơn giản để có chỗ ở lý tưởng</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s, i) => (
                        <div key={s.step} className="text-center relative">
                            {i < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                            )}
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                                <s.icon className="w-8 h-8 text-primary" />
                                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                                    {s.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
