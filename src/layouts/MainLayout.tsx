import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Outlet /> {/* Dashboard sẽ hiển thị ở đây */}
            </main>
            <Footer />
        </div>
    );
}