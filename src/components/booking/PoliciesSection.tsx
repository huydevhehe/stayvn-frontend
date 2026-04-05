import { Clock, XCircle, BookOpen, FileText } from "lucide-react";

const policies = [
    {
        icon: Clock,
        title: "Giờ nhận / trả phòng",
        items: ["Check-in: từ 14:00", "Check-out: trước 12:00", "Nhận phòng sớm / trả muộn: liên hệ lễ tân"],
    },
    {
        icon: XCircle,
        title: "Chính sách hủy phòng",
        items: [
            "Miễn phí hủy trước 24 giờ (phòng Deluxe)",
            "Không hoàn tiền (phòng Superior)",
            "Thuê tháng: báo trước 30 ngày",
        ],
    },
    {
        icon: BookOpen,
        title: "Nội quy",
        items: [
            "Không hút thuốc trong phòng",
            "Không mang thú cưng",
            "Giữ trật tự sau 22:00",
            "Xuất trình CCCD/Passport khi nhận phòng",
        ],
    },
    {
        icon: FileText,
        title: "Điều khoản thuê tháng",
        items: [
            "Hợp đồng tối thiểu 3 tháng",
            "Đặt cọc 1 tháng tiền thuê",
            "Thanh toán đầu mỗi tháng",
            "Dọn phòng miễn phí 2 lần/tuần",
        ],
    },
];

const PoliciesSection = () => {
    return (
        <section className="space-y-5" id="policies">
            <h2 className="text-xl font-bold text-foreground">Chính sách</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map(({ icon: Icon, title, items }) => (
                    <div key={title} className="p-5 rounded-2xl border bg-card space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground">{title}</h3>
                        </div>
                        <ul className="space-y-1.5">
                            {items.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-border flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PoliciesSection;
