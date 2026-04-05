import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bath, ChevronRight, Edit, Home, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import amenityService from "../../api/amenityService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Amenity } from "../../types/admin";

const AmenityPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");

  const { data: amenities = [], isLoading } = useQuery({
    queryKey: ["amenities"],
    queryFn: amenityService.getAmenities,
  });

  const createMutation = useMutation({
    mutationFn: amenityService.createAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Đã tạo tiện ích thành công");
      closeModal();
    },
    onError: () => toast.error("Lỗi khi tạo tiện ích"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, nextName }: { id: number; nextName: string }) =>
      amenityService.updateAmenity(id, nextName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Đã cập nhật tiện ích thành công");
      closeModal();
    },
    onError: () => toast.error("Lỗi khi cập nhật tiện ích"),
  });

  const deleteMutation = useMutation({
    mutationFn: amenityService.deleteAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      toast.success("Đã xóa tiện ích thành công");
    },
    onError: () => toast.error("Lỗi khi xóa tiện ích"),
  });

  const filteredAmenities = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return amenities;
    }

    return amenities.filter((amenity) =>
      amenity.name.toLowerCase().includes(keyword) ||
      amenity.id.toString().includes(keyword)
    );
  }, [amenities, searchTerm]);

  const openCreateModal = () => {
    setEditingAmenity(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEditModal = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setName(amenity.name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAmenity(null);
    setName("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Tên tiện ích không được để trống");
      return;
    }

    if (editingAmenity) {
      await updateMutation.mutateAsync({ id: editingAmenity.id, nextName: trimmedName });
      return;
    }

    await createMutation.mutateAsync(trimmedName);
  };

  const columns = [
    { header: "ID", accessor: "id" as const },
    { header: "Tên tiện ích", accessor: "name" as const },
    {
      header: "Thao tác",
      accessor: (amenity: Amenity) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEditModal(amenity)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm(`Xóa tiện ích "${amenity.name}"?`)) {
                deleteMutation.mutate(amenity.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Tiện ích</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">
            Quản lý Tiện ích
          </h2>
          <p className="text-muted-foreground mt-1">
            Tạo, cập nhật và xóa các dịch vụ hiển thị trong danh sách khách sạn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo ID hoặc tên tiện ích"
              className="pl-9"
            />
          </div>
          <Button
            onClick={openCreateModal}
            className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
          >
            <Plus className="w-5 h-5" /> Thêm tiện ích
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-3xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Bath className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng tiện ích</p>
              <h3 className="text-3xl font-bold">{amenities.length}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-white/70 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kết quả tìm kiếm</p>
              <h3 className="text-3xl font-bold">{filteredAmenities.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={filteredAmenities} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingAmenity ? "Chỉnh sửa tiện ích" : "Thêm tiện ích mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="amenity-name">Tên tiện ích</Label>
            <Input
              id="amenity-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Hồ bơi"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={closeModal} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : editingAmenity ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AmenityPage;
