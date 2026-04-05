import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "Khách sạn có hỗ trợ đưa đón sân bay không?",
        a: "Có, chúng tôi cung cấp dịch vụ đưa đón sân bay Tân Sơn Nhất với phí phụ trội 250.000 VND/lượt. Vui lòng đặt trước ít nhất 24 giờ.",
    },
    {
        q: "Tôi có thể thanh toán bằng phương thức nào?",
        a: "Chúng tôi chấp nhận thẻ Visa, Mastercard, chuyển khoản ngân hàng, ví MoMo, ZaloPay và tiền mặt.",
    },
    {
        q: "Có giảm giá khi thuê dài hạn không?",
        a: "Có, chúng tôi giảm 10% cho hợp đồng 6 tháng và 15% cho hợp đồng 12 tháng trở lên.",
    },
    {
        q: "Phòng có bếp nấu ăn không?",
        a: "Phòng Studio và Duplex đều được trang bị bếp nhỏ gọn với tủ lạnh, bếp từ và lò vi sóng.",
    },
    {
        q: "Chính sách về trẻ em như thế nào?",
        a: "Trẻ em dưới 6 tuổi được ở miễn phí khi sử dụng giường có sẵn. Giường phụ có thể được yêu cầu với phí 300.000 VND/đêm.",
    },
];

const FAQSection = () => {
    return (
        <section className="space-y-5" id="faq">
            <h2 className="text-xl font-bold text-foreground">Câu hỏi thường gặp</h2>
            <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                    <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="border rounded-2xl px-5 bg-card data-[state=open]:shadow-card"
                    >
                        <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline py-4">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
};

export default FAQSection;
