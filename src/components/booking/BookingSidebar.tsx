// src/components/booking/BookingSidebar.tsx
import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Users, ShieldCheck, Minus, Plus, Info, Crown } from "lucide-react";

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import roomService from "@/api/roomService";
import monthlyRentalService from "@/api/monthlyRentalService";

import type { RoomType, Room, MonthlyRental } from "@/types/admin";
import BookingModal from "./BookingModal";
import { useAuth } from "@/auth/AuthContext";

export interface BookingSidebarRef {
  selectRoom: (room: Room) => void;
  selectMonthlyRoom: (room: MonthlyRental) => void;
}

const BookingSidebar = forwardRef<BookingSidebarRef>((_, ref) => {
  const { id: hotelIdParam } = useParams<{ id: string }>();
  const hotelId = Number(hotelIdParam);

  const [mode, setMode] = useState<"room" | "monthly">("room");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [monthlyRentals, setMonthlyRentals] = useState<MonthlyRental[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedMonthlyRental, setSelectedMonthlyRental] = useState<MonthlyRental | null>(null);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalBookingData, setModalBookingData] = useState<{
    roomType: RoomType;
    roomId: number;
    checkIn: Date;
    checkOut: Date;
  } | null>(null);

  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  // ==================== EXPOSE HÀM CHO BÊN NGOÀI ====================
  useImperativeHandle(ref, () => ({
    selectRoom: (room: Room) => {
      if (selectedRoom?.id === room.id) return;

      setMode("room");
      setSelectedRoom(room);
      setSelectedMonthlyRental(null);

      const capacity = roomTypes.find((t) => t.id === room.roomTypeId)?.capacity || 2;
      setGuests(capacity);

      toast.success(`Đã chọn phòng: ${room.roomNumber}`, {
        id: "select-room",
      });
    },

    selectMonthlyRoom: (room: MonthlyRental) => {
      if (selectedMonthlyRental?.id === room.id) return;

      setMode("monthly");
      setSelectedMonthlyRental(room);
      setSelectedRoom(null);

      toast.success(`Đã chọn phòng tháng: ${room.name}`, {
        id: "select-monthly-room",
      });
    },
  }), [roomTypes]);

  // Fetch data
  useEffect(() => {
    if (!hotelId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      roomService.getRoomTypesByHotelId(hotelId),
      monthlyRentalService.getAll(),
      roomService.getRooms(),
    ])
      .then(([types, monthly, allRooms]) => {
        const hotelRoomTypes = types.filter((t) => t.hotelId === hotelId);
        setRoomTypes(hotelRoomTypes);
        setMonthlyRentals(monthly);

        const hotelRoomTypeIds = hotelRoomTypes.map((t) => t.id);
        setRooms(allRooms.filter((r) => hotelRoomTypeIds.includes(r.roomTypeId)));
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi khi tải dữ liệu phòng");
      })
      .finally(() => setLoading(false));
  }, [hotelId]);

  // Fetch booked dates for selected room
  useEffect(() => {
    if (mode === "room" && selectedRoom) {
      import("@/api/bookingService").then((m) => {
        m.default.getBookedDates(selectedRoom.id).then((dates) => {
          setBookedDates(dates.map((d) => new Date(d)));
        });
      });
    } else {
      setBookedDates([]);
    }
  }, [mode, selectedRoom]);

  // Filter & Calculations
  const filteredRooms = useMemo(() => {
    if (mode !== "room") return [];
    return rooms.filter((room) => {
      const type = roomTypes.find((t) => t.id === room.roomTypeId);
      return (type?.capacity || 0) >= guests;
    });
  }, [rooms, roomTypes, guests, mode]);

  const roomOptions = useMemo(() => {
    return filteredRooms.map((room) => {
      const type = roomTypes.find((t) => t.id === room.roomTypeId);
      return {
        id: room.id,
        displayName: `${type?.name || "Phòng không tên"} - ${room.roomNumber}`,
        price: type?.pricePerNight || 0,
      };
    });
  }, [filteredRooms, roomTypes]);

  const pricePerNight = useMemo(() => {
    if (mode === "room" && selectedRoom) {
      const type = roomTypes.find((t) => t.id === selectedRoom.roomTypeId);
      return type?.pricePerNight || 0;
    }
    return 0;
  }, [mode, selectedRoom, roomTypes]);

  const monthlyPrice = useMemo(() => {
    if (mode === "monthly" && selectedMonthlyRental) return selectedMonthlyRental.monthlyPrice || 0;
    return 0;
  }, [mode, selectedMonthlyRental]);

  const basePrice = mode === "monthly" ? monthlyPrice : pricePerNight;
  const isValidPrice = basePrice > 0;

  const nights = useMemo(() => {
    if (mode === "monthly" || !checkIn || !checkOut) return 1;
    return Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
  }, [checkIn, checkOut, mode]);

  const subtotal = useMemo(() => {
    return mode === "monthly" ? monthlyPrice : pricePerNight * nights;
  }, [mode, monthlyPrice, pricePerNight, nights]);

  const serviceFee = isValidPrice ? Math.round(subtotal * 0.05) : 0;
  const tax = isValidPrice ? Math.round(subtotal * 0.1) : 0;
  const cleaningFee = isValidPrice ? (mode === "monthly" ? 500000 : 200000) : 0;
  const total = subtotal + serviceFee + tax + cleaningFee;

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleOpenBookingModal = () => {
    if (mode === "monthly") {
      if (!selectedMonthlyRental) {
        toast.error("Vui lòng chọn phòng trọ để đặt cọc");
        return;
      }
      setModalBookingData({
        roomType: {
          id: selectedMonthlyRental.id,
          name: selectedMonthlyRental.name,
          pricePerNight: selectedMonthlyRental.monthlyPrice, // Map với pricePerNight để Modal dùng
          capacity: 2,
        } as any,
        roomId: selectedMonthlyRental.id,
        checkIn: new Date(), // Dùng tạm cho modal, sẽ input thực tế trong modal
        checkOut: new Date(), 
      });
      setShowModal(true);
      return;
    }

    if (!selectedRoom || !checkIn || !checkOut) {
      toast.error("Vui lòng chọn phòng và ngày nhận/trả phòng");
      return;
    }

    const roomType = roomTypes.find((t) => t.id === selectedRoom.roomTypeId);
    if (!roomType) {
      toast.error("Không tìm thấy thông tin loại phòng");
      return;
    }

    setModalBookingData({ 
      roomType, 
      roomId: selectedRoom.id, 
      checkIn, 
      checkOut 
    });
    setShowModal(true);
  };

  if (loading) return <div className="p-6 text-center">Đang tải dữ liệu phòng...</div>;
  if (error) return <div className="p-6 text-destructive text-center">{error}</div>;

  return (
    <div id="booking-sidebar" className="rounded-3xl border bg-card shadow-xl p-6 space-y-6 sticky top-24 transition-all duration-300 hover:shadow-2xl">
      
      {/* VIP Badge */}
      {user?.isLoyalty && mode === "room" && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 rounded-2xl shadow-lg shadow-indigo-200 anim-pulse-slow">
           <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Crown className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-[11px] font-black uppercase tracking-widest leading-none mb-1">StayVN Loyalty</span>
                <span className="text-white/90 text-xs font-bold leading-none italic">Đặc quyền: Miễn cọc 20%</span>
              </div>
           </div>
        </div>
      )}

      {/* Booking Mode */}
      <Select
        value={mode}
        onValueChange={(value: "room" | "monthly") => {
          setMode(value);
          setSelectedRoom(null);
          setSelectedMonthlyRental(null);
        }}
      >
        <SelectTrigger className="w-full rounded-xl">
          <SelectValue placeholder="Chọn loại đặt phòng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="room">Phòng theo đêm</SelectItem>
          <SelectItem value="monthly">Phòng thuê tháng</SelectItem>
        </SelectContent>
      </Select>

      {/* Chọn phòng */}
      <Select
        value={mode === "room" ? selectedRoom?.id.toString() || "" : selectedMonthlyRental?.id?.toString() || ""}
        onValueChange={(val) => {
          if (mode === "room") {
            const room = rooms.find((r) => r.id.toString() === val);
            if (room) {
              setMode("room");
              setSelectedRoom(room);
              setSelectedMonthlyRental(null);

              const capacity =
                roomTypes.find((t) => t.id === room.roomTypeId)?.capacity || 2;
              setGuests(capacity);

              toast.success(`Đã chọn phòng: ${room.roomNumber}`);
            }
          } else {
            const room = monthlyRentals.find((r) => r.id?.toString() === val);
            if (room) {
              setMode("monthly");
              setSelectedMonthlyRental(room);
              setSelectedRoom(null);

              toast.success(`Đã chọn phòng tháng: ${room.name}`);
            }
          }
        }}
        disabled={(mode === "room" && rooms.length === 0) || (mode === "monthly" && monthlyRentals.length === 0)}
      >
        <SelectTrigger className="w-full rounded-xl">
          <SelectValue>
            {mode === "room"
              ? selectedRoom
                ? `${roomTypes.find((t) => t.id === selectedRoom.roomTypeId)?.name} - ${selectedRoom.roomNumber}`
                : filteredRooms.length === 0 ? "Không có phòng phù hợp" : "Chọn phòng"
              : selectedMonthlyRental
              ? selectedMonthlyRental.name
              : monthlyRentals.length === 0 ? "Không có phòng thuê tháng" : "Chọn phòng thuê tháng"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
          {mode === "room"
            ? roomOptions.map((room) => (
                <SelectItem
                  key={room.id}
                  value={room.id.toString()}
                  className="hover:bg-primary/10 rounded-md transition-colors"
                >
                  {room.displayName} — {formatVND(room.price)}
                </SelectItem>
              ))
            : monthlyRentals.map((room) => (
                <SelectItem
                  key={room.id}
                  value={room.id.toString()}
                  className="hover:bg-primary/10 rounded-md transition-colors"
                >
                  {room.name} — {formatVND(room.monthlyPrice)}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>

      {/* Số lượng khách */}
      <div className="p-4 rounded-2xl border-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold">Số lượng khách</span>
          </div>
          <div className="flex items-center gap-4 bg-secondary/50 rounded-full px-2 py-1">
            <button
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="h-7 w-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:text-primary transition-all"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="text-sm font-bold w-4 text-center">{guests}</span>
            <button
              onClick={() => setGuests(Math.min(10, guests + 1))}
              className="h-7 w-7 rounded-full bg-background border shadow-sm flex items-center justify-center hover:text-primary transition-all"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Chọn ngày nhận/trả phòng */}
      {mode === "room" && isValidPrice && (
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Nhận phòng", date: checkIn, setter: setCheckIn },
            { label: "Trả phòng", date: checkOut, setter: setCheckOut },
          ].map((d, idx) => (
            <Popover key={idx}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left text-xs font-semibold rounded-xl h-14 border-2 w-full",
                    !d.date && "text-muted-foreground"
                  )}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] uppercase opacity-60">{d.label}</span>
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-2 text-primary" />
                      {d.date ? format(d.date, "dd/MM/yyyy") : "Chọn ngày"}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2 bg-white border rounded-xl shadow-lg" align="start">
                <Calendar
                  mode="single"
                  selected={d.date}
                  onSelect={(date) => {
                    if (!date) return;
                    if (d.label === "Nhận phòng") {
                      setCheckIn(date);
                      // Nếu ngày nhận >= ngày trả, tự động đặt ngày trả là ngày hôm sau
                      if (!checkOut || date >= checkOut) {
                        const nextDay = new Date(date);
                        nextDay.setDate(date.getDate() + 1);
                        setCheckOut(nextDay);
                      }
                    } else {
                      setCheckOut(date);
                      // Nếu chọn ngày trả <= ngày nhận hiện tại (trường hợp hiếm do đã bị disabled), xử lý lại ngày nhận
                      if (checkIn && date <= checkIn) {
                         const prevDay = new Date(date);
                         prevDay.setDate(date.getDate() - 1);
                         setCheckIn(prevDay);
                      }
                    }
                  }}
                  locale={vi}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Khóa ngày đã được đặt
                    const isBooked = bookedDates.some(
                      (bd) => bd.getFullYear() === date.getFullYear() &&
                              bd.getMonth() === date.getMonth() &&
                              bd.getDate() === date.getDate()
                    );
                    if (isBooked) return true;

                    // Ngày trả phòng không được nhỏ hơn hoặc bằng ngày nhận phòng
                    if (d.label === "Trả phòng" && checkIn) {
                      return date <= checkIn;
                    }
                    
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          ))}
        </div>
      )}

      {/* Giá hiển thị */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground font-medium">Chỉ từ</span>
          <span className="text-3xl font-black text-primary">
            {isValidPrice ? formatVND(basePrice) : "0 ₫"}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            / {mode === "monthly" ? "tháng" : "đêm"}
          </span>
        </div>
        {!isValidPrice && <p className="text-xs text-destructive">Vui lòng chọn phòng để xem giá</p>}
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {mode === "monthly" ? "Giá thuê tháng" : `${formatVND(pricePerNight)} x ${nights} đêm`}
          </span>
          <span className="font-semibold">{formatVND(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Phí dịch vụ hệ thống <Info className="h-3 w-3" />
          </span>
          <span className="font-semibold">{formatVND(serviceFee)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Thuế VAT (10%)</span>
          <span className="font-semibold">{formatVND(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vệ sinh</span>
          <span className="font-semibold">{formatVND(cleaningFee)}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-end">
          <span className="text-base font-bold">
            {user?.isLoyalty && mode === "room" ? "Tổng thanh toán sau" : "Tổng cộng"}
          </span>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{formatVND(total)}</p>
            <p className="text-[10px] text-muted-foreground italic">
              {user?.isLoyalty && mode === "room" ? "Thanh toán 100% tại khách sạn" : "Đã bao gồm tất cả các loại phí"}
            </p>
          </div>
        </div>
      </div>

      {/* Nút đặt phòng */}
      <div className="space-y-3">
        <Button
          className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all uppercase tracking-tight"
          disabled={!isValidPrice || (mode === "room" && (!checkIn || !checkOut))}
          onClick={handleOpenBookingModal}
        >
          {mode === "monthly" ? "Gửi yêu cầu thuê tháng" : "Xác nhận đặt phòng"}
        </Button>
      </div>

      {/* Trust Badge */}
      <div className="flex items-center gap-3 text-[11px] font-bold text-success bg-success/5 p-3 rounded-xl border border-success/20">
        <ShieldCheck className="h-5 w-5" />
        <p>Cam kết giá tốt nhất & Thanh toán bảo mật 100%</p>
      </div>

      {/* Booking Modal */}
      {showModal && modalBookingData && (
        <BookingModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setModalBookingData(null);
          }}
          hotelId={hotelId}
          roomType={modalBookingData.roomType}
          roomId={modalBookingData.roomId}
          checkIn={modalBookingData.checkIn}
          checkOut={modalBookingData.checkOut}
          isMonthly={mode === "monthly"}
        />
      )}
    </div>
  );
});

export default BookingSidebar;