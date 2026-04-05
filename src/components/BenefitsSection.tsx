import { ShieldCheck, XCircle, FileCheck, Headphones } from "lucide-react";

const benefits = [
    { icon: ShieldCheck, title: "Thanh toán an toàn", desc: "Giao dịch được mã hóa, bảo mật tuyệt đối với nhiều phương thức thanh toán." },
    { icon: XCircle, title: "Hủy miễn phí", desc: "Hủy phòng miễn phí trước 24h, linh hoạt thay đổi kế hoạch bất cứ lúc nào." },
    { icon: FileCheck, title: "Hợp đồng minh bạch", desc: "Điều khoản rõ ràng, không phí ẩn, không rủi ro cho người thuê." },
    { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ mọi lúc, mọi nơi." },
];

const BenefitsSection = () => {
    return (
        <section className="py-16 lg:py-20">
            <div className="section-padding">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Tại sao chọn StayVN?</h2>
                    <p className="text-muted-foreground">Nền tảng đặt phòng đáng tin cậy hàng đầu Việt Nam</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((b) => (
                        <div key={b.title} className="text-center p-6 rounded-2xl bg-card card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                                <b.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
