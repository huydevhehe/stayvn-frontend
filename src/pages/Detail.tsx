// src/pages/Detail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { Separator } from "@/components/ui/separator";

import HeroGallery from "@/components/booking/HeroGallery";
import OverviewSection from "@/components/booking/OverviewSection";
import RoomTypesSection from "@/components/booking/RoomTypesSection";
import MonthlyRentalSection from "@/components/booking/MonthlyRentalSection";
import AmenitiesSection from "@/components/booking/AmenitiesSection";
import ReviewsSection from "@/components/booking/ReviewsSection";
import MapSection from "@/components/booking/MapSection";
import PoliciesSection from "@/components/booking/PoliciesSection";
import FAQSection from "@/components/booking/FAQSection";
import BookingSidebar, { BookingSidebarRef } from "@/components/booking/BookingSidebar";
import SimilarSection from "@/components/booking/SimilarSection";
import RecentlyViewedSection from "@/components/booking/RecentlyViewedSection";

import hotelService from "@/api/hotelService";
import roomService from "@/api/roomService";
import reviewService from "@/api/reviewService";

import type { Hotel, Room, Review, MonthlyRoom } from "@/types/admin";

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const bookingSidebarRef = useRef<BookingSidebarRef>(null);

  const [hotelInfo, setHotelInfo] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(4.8);

  // Thêm state để quản lý dữ liệu tương tự và đã xem gần đây
  const [similarHotels, setSimilarHotels] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const data = await reviewService.getReviewsByHotelId(Number(id));
      const approved = data.filter(r => r.status === "APPROVED");
      setReviews(approved);

      if (approved.length > 0) {
        const avg = approved.reduce((sum, r) => sum + (r.rating || 0), 0) / approved.length;
        setAvgRating(Number(avg.toFixed(1)));
      }
    } catch (err) {
      console.error("Fetch reviews error:", err);
    }
  }, [id]);

  const fetchHotelDetail = async () => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data: Hotel = await hotelService.getHotelById(Number(id));
      setHotelInfo(data);

      const roomsData = await roomService.getRooms();
      const roomTypeIds = data.roomTypes?.map(rt => rt.id) || [];
      const filteredRooms = roomsData.filter(r => roomTypeIds.includes(r.roomTypeId));
      setRooms(filteredRooms);

      await fetchReviews();

      // === FETCH SIMILAR HOTELS ===
      try {
        const similarData = await hotelService.getSimilarHotels(Number(id));
        setSimilarHotels(similarData || []);
      } catch (err) {
        console.warn("Không lấy được khách sạn tương tự:", err);
        setSimilarHotels([]);
      }

      // === FETCH RECENTLY VIEWED (nếu có) ===
      // Bạn có thể triển khai sau, tạm để rỗng hoặc lấy từ localStorage
      setRecentlyViewed([]);

    } catch (err: any) {
      console.error("Fetch hotel detail error:", err);
      setError(err.response?.data?.message || "Lỗi server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelDetail();
  }, [id, navigate, fetchReviews]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">Đang tải thông tin khách sạn...</p>
      </div>
    );
  }

  if (error || !hotelInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 mb-4 text-lg">
            {error || "Không tìm thấy khách sạn"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-primary text-white rounded-xl"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">StayVN</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#rooms" className="hover:text-primary transition-colors">Phòng</a>
            <a href="#amenities" className="hover:text-primary transition-colors">Tiện ích</a>
            <a href="#reviews" className="hover:text-primary transition-colors">Đánh giá</a>
            <a href="#location" className="hover:text-primary transition-colors">Vị trí</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT - Nội dung chính */}
          <div className="flex-1 space-y-10">
            <HeroGallery
              images={hotelInfo.imageUrls}
              name={hotelInfo.name}
              address={hotelInfo.address}
            />

            <Separator />
            <OverviewSection data={hotelInfo} />

            <Separator />
            <RoomTypesSection
              hotelId={hotelInfo.id.toString()}
              roomTypes={hotelInfo.roomTypes || []}
              rooms={rooms}
              onSelectRoom={(room) => bookingSidebarRef.current?.selectRoom(room)}
            />

            <Separator />
            <MonthlyRentalSection 
              monthlyRooms={hotelInfo.monthlyRooms || []}
              onSelectMonthlyRoom={(room) => bookingSidebarRef.current?.selectMonthlyRoom(room)}
            />

            <Separator />
            <AmenitiesSection amenities={hotelInfo.amenities} />

            <Separator />
            <ReviewsSection
              hotelId={hotelInfo.id.toString()}
              reviews={reviews}
              rating={avgRating}
              reviewsCount={reviews.length}
              onReload={fetchReviews}
            />

            <Separator />
            <MapSection address={hotelInfo.address} />

            <Separator />
            <PoliciesSection />

            <Separator />
            <FAQSection />
          </div>

          {/* RIGHT - Booking Sidebar */}
          <div className="w-full lg:w-[380px] lg:sticky lg:top-24 self-start">
            <BookingSidebar ref={bookingSidebarRef} />
          </div>
        </div>

        <div className="mt-16 space-y-12">
          {similarHotels.length > 0 && (
            <>
              <Separator />
              <SimilarSection currentHotelId={id} />
            </>
          )}

          {recentlyViewed.length > 0 && (
            <>
              <Separator />
              <RecentlyViewedSection />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Detail;