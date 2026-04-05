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
import { Plus, CheckCircle, XCircle, Home, ChevronRight } from "lucide-react";
import { Room, CreateRoomRequest } from "../../types/admin";
import { Link } from "react-router-dom";

const RoomPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [selectedHotelId, setSelectedHotelId] = useState<number | "">("");
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<CreateRoomRequest>({
    roomTypeId: selectedRoomTypeId || 0,
    roomNumber: "",
  });

  // ===== HOTELS =====
  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  // ===== ROOM TYPES =====
  const { data: roomTypes = [] } = useQuery({
    queryKey: ["room-types", selectedHotelId],
    queryFn: () =>
      roomService.getRoomTypesByHotelId(selectedHotelId as number),
    enabled: !!selectedHotelId,
  });

  // ===== ROOMS (FETCH ALL, FILTER LOCALLY) =====
  const { data: allRooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: roomService.getRooms,
  });

  const rooms = allRooms.filter((r) => r.roomTypeId === selectedRoomTypeId);

  // ===== CREATE ROOM =====
  const createMutation = useMutation({
    mutationFn: roomService.createRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Đã tạo phòng thành công");
      setIsModalOpen(false);
      setFormData({ roomTypeId: 0, roomNumber: "" });
    },
    onError: () => toast.error("Lỗi khi tạo phòng"),
  });

  // ===== UPDATE STATUS =====
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      roomService.updateRoomStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Đã cập nhật trạng thái");
    },
  });

  // ===== SUBMIT =====
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.roomTypeId === 0) {
      toast.error("Vui lòng chọn một loại phòng");
      return;
    }

    createMutation.mutate(formData);
  };

  // ===== TABLE =====
  const columns = [
    { header: "ID", accessor: "id" as keyof Room },
    { header: "Tên phòng", accessor: "roomNumber" as keyof Room },
    {
      header: "Trạng thái",
      accessor: (r: Room) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${r.status === "AVAILABLE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
            }`}
        >
          {r.status === "AVAILABLE" ? "CÒN TRỐNG" : "ĐÃ CÓ KHÁCH"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (r: Room) => (
        <div className="flex items-center gap-2">
          {r.status === "AVAILABLE" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                statusMutation.mutate({ id: r.id, status: "OCCUPIED" })
              }
              className="text-red-600"
            >
              <XCircle className="w-4 h-4" /> Set Occupied
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                statusMutation.mutate({ id: r.id, status: "AVAILABLE" })
              }
              className="text-green-600"
            >
              <CheckCircle className="w-4 h-4" /> Set Available
            </Button>
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
        <span className="font-medium text-foreground">Phòng</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight hero-highlight">Quản lý Phòng</h2>
          <p className="text-muted-foreground mt-1">
            Quản lý trạng thái chi tiết và sự sẵn có của từng phòng.
          </p>
        </div>

        <Button
          onClick={() => {
            setFormData({
              roomTypeId: selectedRoomTypeId || 0,
              roomNumber: "",
            });
            setIsModalOpen(true);
          }}
          className="gap-2 px-6 py-6 h-auto text-lg rounded-2xl shadow-lg hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="w-5 h-5" /> Thêm phòng mới
        </Button>
      </div>

      {/* SELECT HOTEL + ROOM TYPE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card p-4 rounded-xl border">
        <div className="space-y-2">
          <Label>Khách sạn:</Label>
          <select
            className="w-full bg-background border border-input rounded-md px-3 py-2"
            value={selectedHotelId}
            onChange={(e) => {
              setSelectedHotelId(
                e.target.value ? Number(e.target.value) : ""
              );
              setSelectedRoomTypeId("");
            }}
          >
            <option value="">Chọn khách sạn</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Loại phòng:</Label>
          <select
            className="w-full bg-background border border-input rounded-md px-3 py-2"
            value={selectedRoomTypeId}
            onChange={(e) =>
              setSelectedRoomTypeId(
                e.target.value ? Number(e.target.value) : ""
              )
            }
            disabled={!selectedHotelId}
          >
            <option value="">Chọn loại phòng</option>
            {roomTypes.map((rt) => (
              <option key={rt.id} value={rt.id}>
                {rt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      {selectedRoomTypeId ? (
        <DataTable columns={columns} data={rooms} isLoading={isLoading} />
      ) : (
        <div className="text-center py-20 border rounded-xl text-gray-500">
          Vui lòng chọn khách sạn và loại phòng để xem danh sách phòng
        </div>
      )}

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm phòng"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Loại phòng</Label>
            <select
              className="w-full bg-background border border-input rounded-md px-3 py-2 mt-1"
              value={formData.roomTypeId}
              onChange={(e) =>
                setFormData({ ...formData, roomTypeId: Number(e.target.value) })
              }
              required
            >
              <option value={0}>Chọn loại phòng</option>
              {hotels.map(h => (
                <optgroup key={h.id} label={h.name}>
                  {roomTypes.filter(rt => rt.hotelId === h.id).map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <Label>Tên phòng / Số phòng</Label>
            <Input
              value={formData.roomNumber}
              onChange={(e) =>
                setFormData({ ...formData, roomNumber: e.target.value })
              }
              placeholder="e.g. 101"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
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

export default RoomPage;