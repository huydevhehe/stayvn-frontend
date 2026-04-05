import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelService from "../../api/hotelService";
import roomService from "../../api/roomService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Plus, DollarSign, Home, ChevronRight } from "lucide-react";
import { RoomPrice, CreateRoomPriceRequest } from "../../types/admin";
import { Link } from "react-router-dom";

const RoomPricePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedHotelId, setSelectedHotelId] = useState<number | "">("");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateRoomPriceRequest>({
    roomTypeId: 0,
    priceDate: new Date().toISOString().split("T")[0],
    price: 0,
  });

  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  const { data: roomTypes = [] } = useQuery({
    queryKey: ["room-types", selectedHotelId],
    queryFn: () => roomService.getRoomTypesByHotelId(selectedHotelId as number),
    enabled: !!selectedHotelId,
  });

  const { data: roomPrices = [], isLoading } = useQuery({
    queryKey: ["room-prices", selectedRoomTypeId],
    queryFn: () => roomService.getPricesByRoomTypeId(selectedRoomTypeId as number),
    enabled: !!selectedRoomTypeId,
  });

  const createMutation = useMutation({
    mutationFn: roomService.createRoomPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-prices", selectedRoomTypeId] });
      toast.success("Đã tạo giá phòng thành công");
      setIsModalOpen(false);
    },
    onError: () => toast.error("Lỗi khi tạo giá phòng"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomTypeId) return;
    createMutation.mutate({ ...formData, roomTypeId: selectedRoomTypeId as number });
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof RoomPrice },
    { header: "Ngày", accessor: "priceDate" as keyof RoomPrice },
    { header: "Giá", accessor: (p: RoomPrice) => `${p.price.toLocaleString()} VNĐ` },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BREADCRUMBS */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Giá phòng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Giá phòng</h2>
          <p className="text-muted-foreground mt-1">
            Cấu hình giá linh hoạt và điều chỉnh theo thời điểm.
          </p>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)} 
          disabled={!selectedRoomTypeId}
          className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" /> Thêm giá mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl border">
        <div className="space-y-2">
          <Label>Chọn Khách sạn:</Label>
          <select
            className="w-full bg-background border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            value={selectedHotelId}
            onChange={(e) => {
              setSelectedHotelId(e.target.value ? Number(e.target.value) : "");
              setSelectedRoomTypeId("");
            }}
          >
            <option value="">-- Chọn khách sạn --</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Chọn Loại phòng:</Label>
          <select
            className="w-full bg-background border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            value={selectedRoomTypeId}
            onChange={(e) => setSelectedRoomTypeId(e.target.value ? Number(e.target.value) : "")}
            disabled={!selectedHotelId}
          >
            <option value="">-- Chọn loại phòng --</option>
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRoomTypeId ? (
        <DataTable columns={columns} data={roomPrices} isLoading={isLoading} />
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground">Vui lòng chọn khách sạn và loại phòng để quản lý giá.</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm giá mới"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price-date">Ngày áp dụng</Label>
            <Input
              id="price-date"
              type="date"
              value={formData.priceDate}
              onChange={(e) => setFormData({ ...formData, priceDate: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-amount">Giá tiền (VNĐ)</Label>
            <Input
              id="price-amount"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Tạo mới
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoomPricePage;
