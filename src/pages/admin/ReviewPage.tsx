import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelService from "../../api/hotelService";
import reviewService from "../../api/reviewService";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle, Star, Home, ChevronRight } from "lucide-react";
import { Review } from "../../types/admin";
import { Link } from "react-router-dom";

const ReviewPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedHotelId, setSelectedHotelId] = useState<number | "">("");

  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", selectedHotelId],
    queryFn: () => reviewService.getReviewsByHotelId(selectedHotelId as number),
    enabled: !!selectedHotelId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reviewService.updateReviewStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", selectedHotelId] });
      toast.success("Đã cập nhật trạng thái đánh giá");
    },
    onError: () => toast.error("Lỗi khi cập nhật trạng thái"),
  });

  const columns = [
    { header: "ID", accessor: "id" as keyof Review },
    { 
      header: "Điểm đánh giá", 
      accessor: (r: Review) => (
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="ml-1 font-bold">{r.rating}</span>
        </div>
      ) 
    },
    { header: "Bình luận", accessor: "comment" as keyof Review, className: "max-w-md truncate" },
    { 
      header: "Trạng thái", 
      accessor: (r: Review) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          r.status === "APPROVED" ? "bg-green-100 text-green-700" : 
          r.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : 
          "bg-red-100 text-red-700"
        }`}>
          {r.status === "APPROVED" ? "ĐÃ DUYỆT" : 
           r.status === "PENDING" ? "CHỜ DUYỆT" : 
           r.status === "REJECTED" ? "BỊ TỪ CHỐI" : r.status}
        </span>
      ) 
    },
    {
      header: "Thao tác",
      accessor: (r: Review) => (
        <div className="flex items-center gap-2">
          {r.status === "PENDING" && (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => statusMutation.mutate({ id: r.id, status: "APPROVED" })}
                className="text-green-600"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => statusMutation.mutate({ id: r.id, status: "REJECTED" })}
                className="text-red-600"
              >
                <XCircle className="w-4 h-4" /> Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BREADCRUMBS */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Đánh giá</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Đánh giá</h2>
          <p className="text-muted-foreground mt-1">
            Lắng nghe khách hàng và duy trì tiêu chuẩn dịch vụ cao nhất.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">
        <Label htmlFor="hotel-select">Chọn khách sạn:</Label>
        <select
          id="hotel-select"
          className="bg-background border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          value={selectedHotelId}
          onChange={(e) => setSelectedHotelId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">-- Chọn khách sạn --</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>
      </div>

      {selectedHotelId ? (
        <DataTable columns={columns} data={reviews} isLoading={isLoading} />
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Vui lòng chọn khách sạn để xem các đánh giá.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
