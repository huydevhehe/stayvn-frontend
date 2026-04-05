import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

import SubscribeForm from "@/components/common/SubscribeForm";
const Footer = () => {
    return (
        <footer className="bg-foreground text-primary-foreground">
            <div className="section-padding py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Company */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">S</span>
                            </div>
                            <span className="text-xl font-bold">StayVN</span>
                        </div>
                        <p className="text-sm text-primary-foreground/60 mb-4 leading-relaxed">
                            Nền tảng đặt phòng và thuê trọ hàng đầu Việt Nam. Kết nối bạn với hàng nghìn chỗ ở chất lượng.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Về chúng tôi</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/60">
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Giới thiệu</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Tuyển dụng</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Báo chí</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Chính sách</h4>
                        <ul className="space-y-2 text-sm text-primary-foreground/60">
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Điều khoản sử dụng</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Chính sách bảo mật</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Quy chế hoạt động</a></li>
                            <li><a href="#" className="hover:text-primary-foreground transition-colors">Giải quyết tranh chấp</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Liên hệ</h4>
                        <SubscribeForm />
                        <ul className="space-y-3 text-sm text-primary-foreground/60">
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> support@stayvn.vn</li>
                            <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> 1900 xxxx</li>
                            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> 123 Nguyễn Huệ, Q.1, TP.HCM</li>
                        </ul>
                        <div className="flex gap-2 mt-4">
                            <div className="px-3 py-2 rounded-lg bg-primary-foreground/10 text-xs font-medium">App Store</div>
                            <div className="px-3 py-2 rounded-lg bg-primary-foreground/10 text-xs font-medium">Google Play</div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 pt-6 text-center text-sm text-primary-foreground/40">
                    © 2026 StayVN. Tất cả quyền được bảo lưu.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
