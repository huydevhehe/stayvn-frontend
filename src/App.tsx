import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext"; // Import từ file bạn đã có
import Login from "./pages/Login";       // Trang login bạn đã làm
import Register from "./pages/Register"; // Trang register bạn đã làm
import NotFound from "./pages/NotFound";   // Trang 404 nếu cần thiết
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";
import UserLayout from "./layouts/UserLayout";

import Detail from "./pages/Detail";
import AdminLayout from "./layouts/AdminLayout";
import HotelPage from "./pages/admin/HotelPage";
import RoomTypePage from "./pages/admin/RoomTypePage";
import RoomPage from "./pages/admin/RoomPage";
import BookingPage from "./pages/admin/BookingPage";
import PaymentPage from "./pages/admin/PaymentPage";
import ReviewPage from "./pages/admin/ReviewPage";
import RoomPricePage from "./pages/admin/RoomPricePage";
import AmenityPage from "./pages/admin/AmenityPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MonthlyRentalPage from "./pages/admin/MonthlyRentalPage";
import AdminMonthlyBookingPage from "./pages/admin/AdminMonthlyBookingPage";
import SearchPage from "./pages/SearchPage";
import LoyaltyManagementPage from "./pages/admin/LoyaltyManagementPage";
import ChatWidget from "./modules/chat/ChatWidget";
import MainLayout from "./layouts/MainLayout";
import ProfilePage from "./pages/user/ProfilePage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import ActiveBookingsPage from "./pages/user/ActiveBookingsPage";
import FavoritesPage from "./pages/user/FavoritesPage";
import SettingsPage from "./pages/user/SettingsPage";
import MyRentalsPage from "./pages/user/MyRentalsPage";
import MonthlyRentalDetailPage from "./pages/MonthlyRentalDetailPage";
import ResaleMarketPage from "./pages/ResaleMarketPage";
import AdminResalePage from "./pages/admin/AdminResalePage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner position="top-right" richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/hotel/:id" element={<Detail />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/monthly-rental/:id" element={<MonthlyRentalDetailPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }>
                <Route index element={<ProfilePage />} />
                <Route path="history" element={<MyBookingsPage />} />
                <Route path="active" element={<ActiveBookingsPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="rentals" element={<MyRentalsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
               <Route path="/resale" element={<ResaleMarketPage />} />
            </Route>

            <Route path="/" element={<Dashboard />} />
            
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Trang 404 */}
            {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
              <Route index element={<AdminDashboard />} />
              <Route path="hotels" element={<HotelPage />} />
              <Route path="room-types" element={<RoomTypePage />} />
              <Route path="rooms" element={<RoomPage />} />
              <Route path="bookings" element={<BookingPage />} />
              <Route path="payments" element={<PaymentPage /> } />
              <Route path="reviews" element={<ReviewPage />} />
              <Route path="room-prices" element={<RoomPricePage />} />
              <Route path="amenities" element={<AmenityPage />} />
              <Route path="monthly-rentals" element={<MonthlyRentalPage />} />
              <Route path="monthly-bookings" element={<AdminMonthlyBookingPage />} />
              <Route path="users" element={<LoyaltyManagementPage />} />
              <Route path="resales" element={<AdminResalePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
         <ChatWidget />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
