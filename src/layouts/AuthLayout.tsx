import { Link } from "react-router-dom";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="flex min-h-screen w-full">
            {/* Cột trái: Form đăng nhập/đăng ký */}
            <div className="flex w-full flex-col justify-center px-4 md:w-1/2 lg:px-20 xl:px-32">
                <div className="mx-auto w-full max-w-md">
                    <Link to="/" className="mb-8 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-sm font-bold text-primary-foreground">S</span>
                        </div>
                        <span className="text-xl font-bold">StayVN</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="mt-2 text-muted-foreground">{subtitle}</p>
                    </div>

                    {children}
                </div>
            </div>

            {/* Cột phải: Hình ảnh & Hiệu ứng (Ẩn trên mobile) */}
            <div className="hidden md:block md:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 gradient-hero" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="max-w-md space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            Tìm nơi dừng chân <br />
                            <span className="hero-highlight">Lý tưởng nhất</span>
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Trải nghiệm hàng ngàn chỗ nghỉ chất lượng cao với giá cả hợp lý nhất Việt Nam.
                        </p>
                    </div>
                    {/* Bạn có thể thêm một cái ảnh minh họa đẹp ở đây */}
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80"
                        alt="Hotel"
                        className="mt-12 rounded-2xl shadow-2xl card-shadow-hover w-4/5 object-cover aspect-video"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;