import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import monthlyRentalService from "../../api/monthlyRentalService";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Home, ChevronRight } from "lucide-react";
import { MonthlyRental } from "../../types/admin";
import { Link } from "react-router-dom";

const MonthlyRentalPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState<MonthlyRental | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: 25,
    monthlyPrice: 3000000,
    deposit: 3000000,
    utilities: "Wifi, Rác, Điện, Nước",
    minContractMonths: 6,
    electricityPrice: 3500,
    waterPrice: 20000,
    wifiPrice: 50000,
    description: "",
    terms: ""
  });

  // ===================== QUERIES =====================
  const { data: rentals = [], isLoading: isRentalsLoading } = useQuery({
    queryKey: ["monthly-rentals"],
    queryFn: monthlyRentalService.getAll,
  });

  // ===================== MUTATIONS =====================
  const createMutation = useMutation({
    mutationFn: (data: any) => monthlyRentalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-rentals"] });
      toast.success("Đã tạo căn trọ thành công!");
      closeModal();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi tạo căn trọ";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => monthlyRentalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-rentals"] });
      toast.success("Cập nhật căn trọ thành công!");
      closeModal();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi cập nhật căn trọ";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => monthlyRentalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-rentals"] });
      toast.success("Xóa căn trọ thành công!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Lỗi khi xóa căn trọ";
      toast.error(msg);
    },
  });

  // ===================== HANDLERS =====================
  const openModal = (rental?: MonthlyRental) => {
    if (rental) {
      setEditingRental(rental);
      setFormData({
        name: rental.name,
        address: rental.address || "",
        area: rental.area,
        monthlyPrice: rental.monthlyPrice,
        deposit: rental.deposit,
        utilities: rental.utilities,
        minContractMonths: rental.minContractMonths,
        electricityPrice: rental.electricityPrice || 3500,
        waterPrice: rental.waterPrice || 20000,
        wifiPrice: rental.wifiPrice || 50000,
        description: rental.description || "",
        terms: rental.terms || "",
      });
      setSelectedFiles([]);
      setPreviews([]);
    } else {
      setEditingRental(null);
      setFormData({
        name: "", address: "", area: 25, monthlyPrice: 3000000, deposit: 3000000,
        utilities: "Wifi, Rác, Điện, Nước", minContractMonths: 6,
        electricityPrice: 3500, waterPrice: 20000, wifiPrice: 50000,
        description: "", terms: ""
      });
      setSelectedFiles([]);
      setPreviews([]);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (confirm("Xóa ảnh này viễn viễn?")) {
        try {
            await monthlyRentalService.deleteImage(imageId);
            toast.success("Đã xóa ảnh!");
            queryClient.invalidateQueries({ queryKey: ["monthly-rentals"] });
            // Cập nhật local state nếu cần
            if (editingRental) {
                const refreshed = await monthlyRentalService.getById(editingRental.id);
                setEditingRental(refreshed);
            }
        } catch (error) {
            toast.error("Lỗi khi xóa ảnh");
        }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRental(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      id: editingRental?.id || null,
      status: editingRental?.status || "AVAILABLE",
      ...formData,
      imageUrls: editingRental?.imageUrls || []
    };

    try {
      let savedRental;
      if (editingRental) {
        savedRental = await updateMutation.mutateAsync({ id: editingRental.id, data: payload });
      } else {
        savedRental = await createMutation.mutateAsync(payload);
      }

      // Xử lý upload ảnh nếu có
      if (selectedFiles.length > 0 && savedRental) {
        await monthlyRentalService.uploadImages(savedRental.id, selectedFiles);
        toast.success(`Đã tải lên ${selectedFiles.length} ảnh mới`);
      }
      
      closeModal();
    } catch (error) {
        // Lỗi đã được xử lý ở Mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===================== TABLE COLUMNS =====================
  const columns = [
    { header: "ID", accessor: "id" as const },
    { 
        header: "Ảnh", 
        accessor: (r: MonthlyRental) => {
            const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80";
            
            const imageUrl = (() => {
                if (!r.imageUrls || r.imageUrls.length === 0) return DEFAULT_IMAGE;
                const firstUrl = r.imageUrls[0];
                if (firstUrl.startsWith('data:') || firstUrl.includes('placeholder')) return DEFAULT_IMAGE;
                return firstUrl.startsWith('http') ? firstUrl : `${API_URL}${firstUrl}`;
            })();
            
            return (
                <img 
                    src={imageUrl} 
                    alt={r.name} 
                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                />
            );
        }
    },
    { header: "Tên phòng", accessor: "name" as const },
    { header: "Địa chỉ", accessor: "address" as const },
    { 
      header: "Giá thuê", 
      accessor: (r: MonthlyRental) => (
          <span className="font-bold text-primary">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(r.monthlyPrice)}</span>
      )
    },
    { header: "Diện tích", accessor: (r: MonthlyRental) => `${r.area} m²` },
    { 
      header: "Điện/Nước", 
      accessor: (r: MonthlyRental) => (
          <div className="text-xs">
              <p>⚡ {r.electricityPrice}đ</p>
              <p>💧 {r.waterPrice}đ</p>
          </div>
      )
    },
    { 
      header: "Trạng thái", 
      accessor: (r: MonthlyRental) => (
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.status === 'AVAILABLE' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
              {r.status === 'AVAILABLE' ? 'TRỐNG' : 'ĐÃ THUÊ'}
          </span>
      )
    },
    {
      header: "Thao tác",
      accessor: (r: MonthlyRental) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openModal(r)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn xóa căn trọ này không?")) {
                deleteMutation.mutate(r.id);
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
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground bg-white/50 w-fit px-4 py-2 rounded-full shadow-sm border border-white/20 backdrop-blur-sm">
        <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5" /> Bảng điều khiển
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="font-medium text-foreground">Quản lý trọ tháng</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">
            Quản lý Phòng trọ
          </h2>
          <p className="text-muted-foreground mt-1">
            Thiết lập danh sách trọ tháng, địa chỉ và bộ ảnh riêng biệt.
          </p>
        </div>
        <Button onClick={() => openModal()} className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg">
          <Plus className="w-5 h-5" /> Thêm phòng trọ mới
        </Button>
      </div>

      <DataTable columns={columns} data={rentals} isLoading={isRentalsLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingRental ? "Chỉnh sửa phòng trọ" : "Thêm phòng trọ mới"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div>
            <Label>Địa chỉ thực tế căn trọ</Label>
            <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                placeholder="Ví dụ: 123 Đường ABC, Hà Nội"
                required 
            />
          </div>

          <div>
            <Label>Tên phòng hiển thị</Label>
            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Diện tích (m²)</Label>
              <Input type="number" value={formData.area} onChange={(e) => setFormData({...formData, area: Number(e.target.value)})} required />
            </div>
            <div>
              <Label>Giá thuê tháng (VNĐ)</Label>
              <Input type="number" value={formData.monthlyPrice} onChange={(e) => setFormData({...formData, monthlyPrice: Number(e.target.value)})} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <Label>Tiền cọc (VNĐ)</Label>
                <Input type="number" value={formData.deposit} onChange={(e) => setFormData({...formData, deposit: Number(e.target.value)})} required />
            </div>
            <div>
                <Label>Kỳ hạn tối thiểu (tháng)</Label>
                <Input type="number" value={formData.minContractMonths} onChange={(e) => setFormData({...formData, minContractMonths: Number(e.target.value)})} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
                <Label>Đơn giá điện (đ/kWh)</Label>
                <Input type="number" value={formData.electricityPrice} onChange={(e) => setFormData({...formData, electricityPrice: Number(e.target.value)})} />
            </div>
            <div>
                <Label>Đơn giá nước (đ/m³)</Label>
                <Input type="number" value={formData.waterPrice} onChange={(e) => setFormData({...formData, waterPrice: Number(e.target.value)})} />
            </div>
            <div>
                <Label>Phí Wifi (đ/tháng)</Label>
                <Input type="number" value={formData.wifiPrice} onChange={(e) => setFormData({...formData, wifiPrice: Number(e.target.value)})} />
            </div>
          </div>

          {/* Existing Images (When Editing) */}
          {editingRental && editingRental.images && editingRental.images.length > 0 && (
            <div className="space-y-2">
                <Label>Ảnh hiện có trong Gallery</Label>
                <div className="grid grid-cols-4 gap-2">
                    {editingRental.images.map((img) => {
                        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
                        const displayUrl = img.imageUrl.startsWith('http') ? img.imageUrl : `${API_URL}${img.imageUrl}`;
                        return (
                            <div key={img.id} className="relative aspect-square border rounded-md overflow-hidden group">
                                <img src={displayUrl} className="w-full h-full object-cover" />
                                <button 
                                    type="button"
                                    className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteExistingImage(img.id)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-2">
            <Label className="text-primary font-bold">Tải ảnh mới từ máy tính</Label>
            <div className="border-2 border-dashed border-primary/20 rounded-xl p-6 text-center hover:bg-primary/5 transition-colors cursor-pointer relative">
                <input 
                    type="file" 
                    multiple 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <Plus className="w-8 h-8 mx-auto text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Kéo thả hoặc nhấn để chọn ảnh (PNG, JPG...)</p>
            </div>
            
            {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                    {previews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square border rounded-md overflow-hidden">
                            <img src={src} className="w-full h-full object-cover" />
                            <button 
                                type="button"
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                                onClick={() => removeFile(idx)}
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>

          <div>
            <Label>Mô tả chi tiết</Label>
            <textarea 
                className="w-full bg-background border rounded-md p-2 min-h-[80px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" className="px-4 py-2 text-sm font-medium" onClick={closeModal}>Hủy</button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : editingRental ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MonthlyRentalPage;
