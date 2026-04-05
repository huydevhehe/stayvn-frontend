const budgets = [
    { label: "Dưới 500K", desc: "Phòng trọ, homestay bình dân", range: "đêm", color: "bg-success/10 text-success" },
    { label: "500K – 1 Triệu", desc: "Khách sạn 3 sao, căn hộ", range: "đêm", color: "bg-primary/10 text-primary" },
    { label: "Trên 1 Triệu", desc: "Resort, khách sạn 5 sao", range: "đêm", color: "bg-warning/10 text-warning" },
    { label: "Dưới 5 Triệu", desc: "Trọ thuê tháng toàn quốc", range: "tháng", color: "bg-accent text-accent-foreground" },
];

const BudgetSection = () => {
    return (
        <section className="py-16 lg:py-20">
            <div className="section-padding">
                <div className="text-center mb-10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Gợi ý theo ngân sách</h2>
                    <p className="text-muted-foreground">Tìm nhanh chỗ ở phù hợp với túi tiền</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {budgets.map((b) => (
                        <button
                            key={b.label}
                            className="group p-6 rounded-2xl bg-card card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 text-left"
                        >
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${b.color}`}>
                                {b.range}
                            </span>
                            <h3 className="text-xl font-bold text-foreground mb-1">{b.label}</h3>
                            <p className="text-sm text-muted-foreground">{b.desc}</p>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BudgetSection;
