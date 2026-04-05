import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import reviewService from "@/api/reviewService";
import type { Review } from "@/types/admin";

interface ReviewsSectionProps {
  hotelId?: string;
  reviews?: Review[];
  rating?: number;
  reviewsCount?: number;
  onReload?: () => void;
}

const categories = [
  { name: "Sạch sẽ", score: 4.9 },
  { name: "Vị trí", score: 4.7 },
  { name: "Dịch vụ", score: 4.8 },
  { name: "Giá trị", score: 4.5 },
];

// Hàm helper tạo sao
const renderStars = (rating: number, size: string = "h-5 w-5") => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`${size} ${
        i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : i < rating
          ? "fill-yellow-400/50 text-yellow-400"   // nửa sao (nếu cần)
          : "text-muted"
      }`}
    />
  ));
};

const ReviewsSection = ({
  hotelId,
  reviews = [],
  rating = 4.8,
  reviewsCount = 0,
  onReload,
}: ReviewsSectionProps) => {

  const [usefulCounts, setUsefulCounts] = useState<{ [key: string]: number }>({});
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleHelpful = (key: string) => {
    setUsefulCounts((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
  };

  const handleSubmitReview = async () => {
    if (!hotelId || !newReview.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      setLoading(true);
      await reviewService.createReview({
        hotelId: Number(hotelId),
        rating: newRating,
        comment: newReview,
      });

      alert("Đánh giá đã gửi! Chờ admin duyệt.");
      setNewReview("");
      setNewRating(5);
      onReload?.();
    } catch (err) {
      console.error(err);
      alert("Gửi đánh giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6 scroll-mt-20" id="reviews">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Đánh giá khách hàng</h2>
        {hotelId && (
          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
            ID: {hotelId}
          </span>
        )}
      </div>

      {/* OVERALL RATING */}
      <div className="flex flex-col md:flex-row gap-10 p-6 rounded-2xl border bg-card/50 shadow-sm">
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <p className="text-5xl font-black text-primary">{rating}</p>

          {/* ⭐ SỬA Ở ĐÂY - Hiển thị đúng số sao tổng thể */}
          <div className="flex gap-0.5 mt-2">
            {renderStars(rating, "h-6 w-6")}
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            Dựa trên {reviewsCount} đánh giá
          </p>
        </div>

        <div className="flex-1 space-y-4">
          {categories.map((c) => (
            <div key={c.name} className="flex items-center gap-4">
              <span className="text-sm w-24">{c.name}</span>
              <div className="flex-1">
                <Progress value={c.score * 20} />
              </div>
              <span className="text-sm font-bold w-8 text-right">{c.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FORM REVIEW */}
      <div className="p-6 border rounded-2xl bg-card space-y-4">
        <h3 className="font-bold text-lg">Viết đánh giá</h3>

        <Input
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              onClick={() => setNewRating(i)}
              className={`text-3xl transition-colors ${
                i <= newRating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <Button onClick={handleSubmitReview} disabled={loading || !newReview.trim()}>
          {loading ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </div>

      {/* REVIEW LIST */}
      <div className="grid grid-cols-1 gap-4 mt-8">
        {reviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Chưa có đánh giá nào cho khách sạn này.
          </p>
        )}

        {reviews.map((r) => {
          const reviewRating = r.rating || 5;
          const content = r.comment || "";

          return (
            <div
              key={r.id}
              className="p-6 rounded-2xl border bg-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {r.userName?.slice(0, 2)?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="font-bold text-sm">{r.userName || "Người dùng"}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('vi-VN') : "Vừa xong"}
                    </p>
                  </div>
                </div>

                {/* ⭐ SỬA Ở ĐÂY - Hiển thị đúng số sao của từng review */}
                <div className="flex gap-0.5">
                  {renderStars(reviewRating, "h-4 w-4")}
                </div>
              </div>

              <p className="text-sm italic">"{content}"</p>

              <div className="flex justify-between pt-2 border-t">
                <button
                  onClick={() => handleHelpful(r.id?.toString() || "review")}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Hữu ích ({(r.helpful || 0) + (usefulCounts[r.id?.toString() || "review"] || 0)})
                </button>

                <span className="text-[10px] text-muted-foreground">Đã xác nhận</span>
              </div>
            </div>
          );
        })}
      </div>

      {reviews.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline">
            Xem tất cả {reviewsCount} đánh giá
          </Button>
        </div>
      )}
    </section>
  );
};

export default ReviewsSection;