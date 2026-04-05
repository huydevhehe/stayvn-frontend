import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const CTASection = () => {
    return (
        <section className="py-16 lg:py-20">
            <div className="section-padding">
                <div className="rounded-3xl bg-primary p-10 lg:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
                    <div className="relative z-10">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-primary-foreground mb-4">
                            Sẵn sàng cho chuyến đi tiếp theo?
                        </h2>
                        <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
                            Hàng nghìn chỗ ở đang chờ bạn khám phá. Bắt đầu ngay hôm nay!
                        </p>
                        <Button
                            size="lg"
                            className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 px-8 font-semibold text-base"
                        >
                            Bắt đầu tìm kiếm
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
