import { useState } from "react";

const SubscribeForm = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!email) return alert("Nhập email");

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.text();
            alert(data);
            setEmail("");
        } catch (err) {
            console.error(err);
            alert("Lỗi gửi email");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="mt-4 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
        <p className="text-sm font-semibold mb-3 text-primary-foreground">
            Nhận thông báo
        </p>

        <div className="flex gap-2">
            <input
                type="email"
                placeholder="Email của bạn"
                className="px-3 py-2 rounded-md bg-white text-black w-full outline-none border border-gray-300 focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button
                onClick={handleSubscribe}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-all"
            >
                {loading ? "..." : "Gửi"}
            </button>
        </div>
    </div>
);
};

export default SubscribeForm;