import { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData.name, formData.email, formData.password);
            toast.success("Tạo tài khoản thành công!", {
                description: "Bây giờ bạn có thể bắt đầu đặt phòng ngay.",
            });
            navigate("/login"); // Hoặc tự động đăng nhập luôn
        } catch (error) {
            toast.error("Đăng ký không thành công", {
                description: "Email này đã được sử dụng hoặc có lỗi hệ thống.",
            });
        }
    };

    return (
        <AuthLayout
            title="Tạo tài khoản mới"
            subtitle="Bắt đầu hành trình tìm kiếm chỗ nghỉ tuyệt vời cùng StayVN"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Trường Họ tên */}
                <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                {/* Trường Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* Trường Mật khẩu */}
                <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">Mật khẩu phải có ít nhất 8 ký tự.</p>
                </div>

                {/* Điều khoản dịch vụ */}
                <div className="flex items-start space-x-2 pt-2">
                    <Checkbox id="terms" required className="mt-1" />
                    <Label htmlFor="terms" className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Tôi đồng ý với{" "}
                        <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a> và{" "}
                        <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a> của StayVN.
                    </Label>
                </div>

                <Button className="w-full mt-4 bg-primary hover:bg-primary/90" type="submit" disabled={loading}>
                    {loading ? "Đang khởi tạo..." : "Đăng ký tài khoản"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                Đã có tài khoản?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Đăng nhập ngay
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;