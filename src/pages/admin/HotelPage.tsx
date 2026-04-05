import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import hotelService from "../../api/hotelService";
import amenityService from "../../api/amenityService";
import cancellationPolicyService from "../../api/cancellationPolicyService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, ShieldAlert, ChevronRight, Home } from "lucide-react";
import { Hotel, Amenity } from "../../types/admin";
import { Link } from "react-router-dom";

const HotelPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [policyData, setPolicyData] = useState({ policyDetails: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    starRating: 5,
    description: "",
  });

  // ===================== QUERIES =====================
  const { data: hotels = [], isLoading: isHotelsLoading } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  const { data: amenities = [] } = useQuery({
    queryKey: ["amenities"],
    queryFn: amenityService.getAmenities,
  });

  // ===================== MUTATIONS =====================
  const createMutation = useMutation({
    mutationFn: hotelService.createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Đã tạo khách sạn thành công!");
      closeModal();
    },
    onError: () => toast.error("Lỗi khi tạo khách sạn"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: any }) =>
      hotelService.updateHotel(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Cập nhật khách sạn thành công!");
      closeModal();
    },
    onError: () => toast.error("Lỗi khi cập nhật khách sạn"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hotelService.deleteHotel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Xóa khách sạn thành công!");
    },
    onError: () => toast.error("Lỗi khi xóa khách sạn"),
  });

  // ===================== HANDLERS =====================
  const openModal = (hotel?: Hotel) => {
    if (hotel) {
      setEditingHotel(hotel);
      setFormData({
        name: hotel.name,
        address: hotel.address,
        starRating: hotel.starRating,
        description: hotel.description || "",
      });
      setSelectedAmenities(hotel.amenities?.map((a) => a.id) || []);
    } else {
      setEditingHotel(null);
      setFormData({ name: "", address: "", starRating: 5, description: "" });
      setSelectedAmenities([]);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHotel(null);
    setSelectedAmenities([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      starRating: formData.starRating,
      description: formData.description.trim() || null,
      amenityIds: selectedAmenities.length > 0 ? selectedAmenities : null,
    };

    try {
      if (editingHotel) {
        await updateMutation.mutateAsync({ id: editingHotel.id, request: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== TABLE COLUMNS =====================
  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Tên khách sạn", accessor: "name" as const },
    { header: "Địa chỉ", accessor: "address" as const },
    {
      header: "Hạng sao",
      accessor: "starRating" as const,
      cell: (hotel: Hotel) => `${hotel.starRating} ⭐`,
    },
    {
      header: "Mô tả",
      accessor: (hotel: Hotel) => (
        <div className="max-w-xs truncate" title={hotel.description || ""}>
          {hotel.description ? hotel.description.substring(0, 60) + "..." : "Chưa có mô tả"}
        </div>
      ),
    },
    {
      header: "Tiện ích",
      accessor: (hotel: Hotel) =>
        hotel.amenities?.map((a) => a.name).join(", ") || "Không có tiện ích",
    },
    {
      header: "Thao tác",
      accessor: (h: Hotel) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openModal(h)}>
            <Edit className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedHotel(h);
              setIsPolicyModalOpen(true);
              cancellationPolicyService
                .getCancellationPolicy(h.id)
                .then((data) => setPolicyData({ policyDetails: data?.policyDetails || "" }))
                .catch(() => setPolicyData({ policyDetails: "" }));
            }}
          >
            <ShieldAlert className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedHotel(h);
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
              if (confirm("Bạn có chắc chắn muốn xóa khách sạn này không?")) {
                deleteMutation.mutate(h.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
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
        <span className="font-medium text-foreground">Khách sạn</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">
            Quản lý Khách sạn
          </h2>
          <p className="text-muted-foreground mt-1">
            Xem, thêm và quản lý danh sách cơ sở lưu trú của bạn một cách dễ dàng.
          </p>
        </div>
        <Button
          onClick={() => openModal()}
          className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" /> Thêm khách sạn mới
        </Button>
      </div>

      {/* TABLE */}
      <DataTable columns={columns} data={hotels} isLoading={isHotelsLoading} />

      {/* ================= CREATE / EDIT MODAL ================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingHotel ? "Chỉnh sửa khách sạn" : "Thêm khách sạn mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="name">Tên khách sạn</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="starRating">Hạng sao</Label>
            <select
              id="starRating"
              className="w-full bg-background border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.starRating}
              onChange={(e) => setFormData({ ...formData, starRating: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Sao
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="description">Mô tả</Label>
            <textarea
              id="description"
              className="w-full bg-background border border-input rounded-md p-3 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-primary"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Nhập mô tả chi tiết về khách sạn..."
            />
          </div>

          <div>
            <Label>Tiện ích (Giữ Ctrl hoặc Cmd để chọn nhiều)</Label>
            <select
              multiple
              className="w-full bg-background border border-input rounded-md p-2 h-40 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedAmenities.map(String)}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
                setSelectedAmenities(values);
              }}
            >
              {amenities.map((amenity: Amenity) => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Đang lưu..."
                : editingHotel
                ? "Cập nhật"
                : "Tạo khách sạn"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Policy Modal */}
      <Modal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title={`Chính sách hủy phòng - ${selectedHotel?.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedHotel) {
              cancellationPolicyService
                .createOrUpdateCancellationPolicy(selectedHotel.id, policyData)
                .then(() => {
                  toast.success("Đã cập nhật chính sách thành công!");
                  setIsPolicyModalOpen(false);
                })
                .catch(() => toast.error("Lỗi khi cập nhật chính sách"));
            }
          }}
        >
          <textarea
            className="w-full h-32 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
            value={policyData.policyDetails}
            onChange={(e) => setPolicyData({ policyDetails: e.target.value })}
            placeholder="Enter cancellation policy details..."
          />
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsPolicyModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu chính sách</Button>
          </div>
        </form>
      </Modal>

      {/* Image Modal - Best version */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => {
          setIsImageModalOpen(false);
          setSelectedFile(null);
        }}
        title={`Hình ảnh - ${selectedHotel?.name}`}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="hotel-image">Chọn ảnh khách sạn</Label>
            <Input
              id="hotel-image"
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Tệp đã chọn: <span className="font-medium">{selectedFile.name}</span>
            </p>
          )}

          <Button
            className="w-full"
            disabled={!selectedFile}
            onClick={() => {
              if (selectedHotel && selectedFile) {
                hotelService
                  .uploadHotelImage(selectedHotel.id, selectedFile)
                  .then(() => {
                    toast.success("Tải ảnh lên thành công!");
                    setIsImageModalOpen(false);
                    setSelectedFile(null);
                  })
                  .catch(() => toast.error("Lỗi khi tải ảnh lên"));
              }
            }}
          >
            Tải ảnh lên
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default HotelPage;