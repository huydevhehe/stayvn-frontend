import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelService from "../../api/hotelService";
import roomService from "../../api/roomService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { toast } from "sonner";
import { Plus, Edit, Image as ImageIcon, DollarSign, Trash2, Home, ChevronRight } from "lucide-react";
import { RoomType, CreateRoomTypeRequest } from "../../types/admin";
import { Link } from "react-router-dom";

const RoomTypePage: React.FC = () => {
  const queryClient = useQueryClient();

  // ✅ FIX: chỉ dùng number | null (KHÔNG dùng "")
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const [formData, setFormData] = useState<CreateRoomTypeRequest>({
    hotelId: selectedHotelId || 0,
    name: "",
    pricePerNight: 0,
    capacity: 2,
  });

  // GET HOTELS
  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  // GET ROOM TYPES
  const { data: roomTypes = [], isLoading } = useQuery({
    queryKey: ["room-types", selectedHotelId],
    queryFn: () =>
      roomService.getRoomTypesByHotelId(selectedHotelId as number),
    enabled: selectedHotelId !== null, // 🔥 FIX CHUẨN
  });

  // CREATE/UPDATE ROOM TYPE
  const mutation = useMutation({
    mutationFn: (data: CreateRoomTypeRequest | { id: number; data: Partial<CreateRoomTypeRequest> }) => {
      if ("id" in data) {
        return roomService.updateRoomType(data.id, data.data);
      }
      return roomService.createRoomType(data as CreateRoomTypeRequest);
    },
    onSuccess: (_, variables) => {
      const hId = "id" in variables ? (variables.data.hotelId || selectedHotelId) : variables.hotelId;
      queryClient.invalidateQueries({
        queryKey: ["room-types", hId],
      });

      toast.success(editingRoomType ? "Đã cập nhật loại phòng thành công" : "Đã tạo loại phòng thành công");

      setIsModalOpen(false);
      setEditingRoomType(null);

      setFormData({
        hotelId: selectedHotelId || 0,
        name: "",
        pricePerNight: 0,
        capacity: 2,
      });
    },
    onError: () => toast.error("Lỗi khi lưu loại phòng"),
  });

  // SUBMIT CREATE/UPDATE
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.hotelId === 0) {
      toast.error("Vui lòng chọn một khách sạn");
      return;
    }

    if (editingRoomType) {
      mutation.mutate({ id: editingRoomType.id, data: formData });
    } else {
      mutation.mutate(formData);
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof RoomType },
    { header: "Tên loại phòng", accessor: "name" as keyof RoomType },
    { header: "Giá/Đêm", accessor: (r: RoomType) => `${r.pricePerNight.toLocaleString()} VNĐ` },
    { header: "Sức chứa", accessor: (r: RoomType) => `${r.capacity} người` },
    {
      header: "Actions",
      accessor: (r: RoomType) => (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setEditingRoomType(r);
              setFormData({
                hotelId: r.hotelId,
                name: r.name,
                pricePerNight: r.pricePerNight,
                capacity: r.capacity,
              });
              setIsModalOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRoomType(r);
              setIsImageModalOpen(true);
            }}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (window.confirm("Bạn có chắc chắn muốn xóa loại phòng này không?")) {
                deleteMutation.mutate(r.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <DollarSign className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // DELETE ROOM TYPE
  const deleteMutation = useMutation({
    mutationFn: roomService.deleteRoomType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["room-types", selectedHotelId],
      });
      toast.success("Xóa loại phòng thành công");
    },
    onError: () => toast.error("Lỗi khi xóa loại phòng"),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* BREADCRUMBS */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Loại phòng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Loại phòng</h2>
          <p className="text-muted-foreground mt-1">
            Định nghĩa và quản lý các hạng mục phòng với giá và sức chứa tùy chỉnh.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingRoomType(null);
            setFormData({
              hotelId: selectedHotelId || 0,
              name: "",
              pricePerNight: 0,
              capacity: 2,
            });
            setIsModalOpen(true);
          }}
          className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" /> Thêm loại phòng mới
        </Button>
      </div>

      {/* SELECT HOTEL */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border">

        <Label>Chọn khách sạn:</Label>

        <select
          className="bg-background border border-input rounded-md px-3 py-2"
          value={selectedHotelId ?? ""}
          onChange={(e) => {
            const value = e.target.value;

            if (value === "") {
              setSelectedHotelId(null);
              return;
            }

            const num = Number(value);

            if (isNaN(num)) {
              setSelectedHotelId(null);
              return;
            }

            setSelectedHotelId(num);
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

      {/* TABLE */}
      {selectedHotelId !== null ? (
        <DataTable
          columns={columns}
          data={roomTypes}
          isLoading={isLoading}
        />
      ) : (
        <div className="text-center py-20 border rounded-xl text-muted-foreground">
          Vui lòng chọn một khách sạn
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoomType(null);
        }}
        title={editingRoomType ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Khách sạn</Label>
            <select
              className="w-full bg-background border border-input rounded-md px-3 py-2 mt-1"
              value={formData.hotelId}
              onChange={(e) =>
                setFormData({ ...formData, hotelId: Number(e.target.value) })
              }
              required
            >
              <option value={0}>-- Chọn khách sạn --</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>Tên loại phòng</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Giá mỗi đêm (VNĐ)</Label>
            <Input
              type="number"
              value={formData.pricePerNight}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  pricePerNight: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div>
            <Label>Sức chứa (người)</Label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: Number(e.target.value),
                })
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {editingRoomType ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* IMAGE MODAL */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setSelectedFiles(null);
          setSelectedRoomType(null);
        }}
        title={`Quản lý hình ảnh - ${selectedRoomType?.name || ""}`}
      >
        <div className="space-y-6">
          {/* Gallery ảnh hiện có */}
          <div>
            <Label className="text-base font-semibold">Ảnh hiện có</Label>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {selectedRoomType?.images && selectedRoomType.images.length > 0 ? (
                selectedRoomType.images.map((img: any, index: number) => (
                  <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={img.imageUrl.startsWith("http") ? img.imageUrl : `${import.meta.env.VITE_API_URL || "http://localhost:8080"}${img.imageUrl}`}
                      alt={`Room ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={async () => {
                        if (window.confirm("Xóa ảnh này?")) {
                          try {
                            await roomService.deleteRoomTypeImage(img.id);
                            toast.success("Đã xóa ảnh");
                            // Refresh data
                            queryClient.invalidateQueries({ queryKey: ["room-types", selectedHotelId] });
                            // Cập nhật state local để biến mất ngay
                            setSelectedRoomType({
                              ...selectedRoomType,
                              images: selectedRoomType.images?.filter((_, i) => i !== index)
                            });
                          } catch {
                            toast.error("Lỗi khi xóa ảnh");
                          }
                        }
                      }}
                      className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center border border-dashed rounded-lg text-muted-foreground">
                  Chưa có hình ảnh nào.
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Tải ảnh mới */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Tải ảnh mới từ máy tính</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="cursor-pointer file:cursor-pointer"
              />
            </div>
            <p className="text-xs text-muted-foreground">Bạn có thể chọn nhiều ảnh cùng lúc.</p>

            <Button
              className="w-full gap-2"
              disabled={!selectedFiles || !selectedRoomType}
              onClick={async () => {
                if (!selectedRoomType || !selectedFiles) return;

                const promise = (async () => {
                  const files = Array.from(selectedFiles);
                  await roomService.uploadRoomTypeImages(selectedRoomType.id, files);
                  queryClient.invalidateQueries({ queryKey: ["room-types", selectedHotelId] });
                  
                  // Giả lập cập nhật UI hoặc đóng modal
                  setIsImageModalOpen(false);
                  setSelectedFiles(null);
                })();

                toast.promise(promise, {
                  loading: "Đang tải ảnh lên...",
                  success: "Đã tải ảnh lên thành công!",
                  error: "Lỗi khi tải ảnh lên",
                });
              }}
            >
              <Plus className="w-4 h-4" /> Bắt đầu tải lên
            </Button>
          </div>

          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="ghost"
              onClick={() => setIsImageModalOpen(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default RoomTypePage;