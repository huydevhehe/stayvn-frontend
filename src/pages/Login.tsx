import { useState } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { toast } from "sonner";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loading, user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const user = await login(email, password);
            toast.success("Đăng nhập thành công!", {
                description: `Chào mừng bạn trở lại, ${email.split('@')[0]}!`,
            });
            
            if (user.role?.toUpperCase().includes("ROLE_ADMIN")) {
                navigate("/admin", { replace: true });
            } else {
                navigate("/", { replace: true });
            }
        } catch (error) {
            toast.error("Đăng nhập thất bại", {
                description: "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
            });
        }
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại"
            subtitle="Nhập email của bạn để truy cập tài khoản"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <a href="#" className="text-sm text-primary hover:underline">Quên mật khẩu?</a>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                    Đăng ký ngay
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;