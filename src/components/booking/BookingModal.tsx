import React, { useState } from "react";
import { Modal } from "../Modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { RoomType } from "@/types/admin";
import { format, addMonths } from "date-fns";
import { toast } from "sonner";
import { Crown } from "lucide-react";
import bookingService from "@/api/bookingService";
import monthlyBookingService from "@/api/monthlyBookingService";
import { useAuth } from "@/auth/AuthContext";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotelId: number;
  roomType: RoomType;
  checkIn: Date;
  checkOut: Date;
  roomId?: number;
  isMonthly?: boolean;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  hotelId,
  roomType,
  roomId,
  checkIn,
  checkOut,
  isMonthly = false,
}) => {
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Guest Info & Monthly Params
  const [guestInfo, setGuestInfo] = useState({
    fullName: user?.name || "",
    phone: "",
    email: user?.email || "",
    adults: 2,
    children: 0,
  });

  const [monthlyParams, setMonthlyParams] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    months: 6
  });

  // Calculation
  const pricePerNight = roomType.pricePerNight; // This is monthlyPrice if isMonthly
  const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000));
  
  const subtotal = isMonthly ? pricePerNight : (pricePerNight * nights);
  const serviceFee = Math.round(subtotal * 0.05);
  const tax = Math.round(subtotal * 0.1);
  const cleaningFee = isMonthly ? 500000 : 200000;
  const total = subtotal + serviceFee + tax + cleaningFee;

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleBookNow = async () => {
    if (!guestInfo.fullName || !guestInfo.phone || !guestInfo.email) {
      toast.error("Vui lòng điền đầy đủ thông tin khách hàng");
      setStep(1);
      return;
    }

    try {
      setIsSubmitting(true);
      if (isMonthly) {
          await monthlyBookingService.book(
              user?.id || 0,
              roomId || 0,
              monthlyParams.startDate,
              monthlyParams.months
          );
          toast.success("Gửi yêu cầu thuê trọ thành công!", {
            description: "Hợp đồng đặt cọc đã được khởi tạo. Vui lòng chờ Admin duyệt.",
          });
          onClose();
          navigate("/profile/rentals");
      } else {
          await bookingService.createBooking({
            userId: user?.id || 1,
            roomId: roomId || roomType.id,
            hotelId: hotelId,
            checkInDate: format(checkIn, "yyyy-MM-dd"),
            checkOutDate: format(checkOut, "yyyy-MM-dd"),
          });
          
          if (user?.isLoyalty) {
            toast.success("Đặc quyền VIP: Đặt phòng thành công!", {
              description: "Đơn hàng của bạn đã được XÁC NHẬN ngay lập tức. Hẹn gặp bạn tại khách sạn!",
            });
          } else {
            toast.success("Đặt phòng thành công!", {
              description: "Yêu cầu của bạn đang được xử lý (PENDING). Vui lòng thanh toán cọc để được xác nhận.",
            });
          }
          onClose();
          navigate("/profile/history");
      }
    } catch (error: any) {
      toast.error("Lỗi giao dịch", {
        description: error?.response?.data?.message || "Đã có lỗi xảy ra.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isMonthly ? `Đặt cọc thuê trọ: ${roomType.name}` : `Đặt phòng: ${roomType.name}`}>
      <div className="space-y-6">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-colors ${
                step >= s ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Bước 1: Thông tin & Thời hạn</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Họ và tên</Label>
                <Input
                  value={guestInfo.fullName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input
                  value={guestInfo.phone}
                  onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                  placeholder="09xxx"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={guestInfo.email}
                  readOnly
                  className="bg-muted/50 cursor-not-allowed"
                />
              </div>
              
              {isMonthly ? (
                  <>
                    <div className="space-y-2">
                        <Label>Ngày bắt đầu ở</Label>
                        <Input 
                            type="date" 
                            value={monthlyParams.startDate}
                            onChange={(e) => setMonthlyParams({...monthlyParams, startDate: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Thời hạn thuê (tháng)</Label>
                        <Input 
                            type="number" 
                            value={monthlyParams.months}
                            onChange={(e) => setMonthlyParams({...monthlyParams, months: parseInt(e.target.value)})}
                        />
                    </div>
                  </>
              ) : (
                  <>
                    <div className="space-y-2">
                        <Label>Người lớn</Label>
                        <Input
                          type="number"
                          value={guestInfo.adults}
                          onChange={(e) => setGuestInfo({ ...guestInfo, adults: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Trẻ em</Label>
                        <Input
                          type="number"
                          value={guestInfo.children}
                          onChange={(e) => setGuestInfo({ ...guestInfo, children: parseInt(e.target.value) })}
                        />
                    </div>
                  </>
              )}
            </div>
            <Button className="w-full mt-4 h-12 rounded-xl font-bold" onClick={handleNext}>
              Tiếp theo: Kiểm tra chi phí
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Bước 2: Xem lại & Chi phí đặt cọc</h4>
            <div className="bg-muted/30 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loại hình:</span>
                <span className="font-semibold">{isMonthly ? "Thuê trọ tháng" : "Đặt phòng đêm"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thời gian:</span>
                <span className="font-semibold text-right">
                  {isMonthly 
                    ? `Từ ${format(new Date(monthlyParams.startDate), "dd/MM/yyyy")} (${monthlyParams.months} tháng)`
                    : `${format(checkIn, "dd/MM")} - ${format(checkOut, "dd/MM")} (${nights} đêm)`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{isMonthly ? "Tiền cọc 1 tháng:" : `Giá phòng (${nights} đêm):`}</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí hồ sơ (5%):</span>
                <span>{formatVND(serviceFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thuế VAT (10%):</span>
                <span>{formatVND(tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vệ sinh bàn giao:</span>
                <span>{formatVND(cleaningFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Tổng giá trị:</span>
                <span className="text-lg font-bold text-slate-700">{formatVND(total)}</span>
              </div>

              {user?.isLoyalty && !isMonthly ? (
                <div className="bg-indigo-600/10 p-4 rounded-2xl border border-indigo-600/20 space-y-2 mt-4 anim-pulse-slow">
                  <div className="flex justify-between items-center text-indigo-700">
                     <span className="text-xs font-black flex items-center gap-2">
                       <Crown className="w-4 h-4 fill-indigo-600" /> ĐẶC QUYỀN VIP
                     </span>
                     <span className="font-black text-sm">MIỄN CỌC 100%</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-indigo-200 pt-2">
                    <span className="text-xs font-bold text-indigo-600">Cần thanh toán ngay:</span>
                    <span className="text-xl font-black text-indigo-700">0 ₫</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-slate-600">Cọc cần trả (20%):</span>
                  <span className="text-xl font-black text-primary">{formatVND(isMonthly ? total : total * 0.2)}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handleBack}>
                Quay lại
              </Button>
              <Button className="flex-[2] h-12 rounded-xl font-bold" onClick={handleNext}>
                Tiếp theo: Xác nhận hợp đồng
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h4 className="font-bold text-lg">Bước 3: Xác nhận & Ký kết</h4>
            <div className="p-4 border-2 border-primary/20 rounded-xl bg-primary/5 space-y-4">
              <p className="text-sm text-muted-foreground italic">
                {isMonthly 
                    ? 'Bằng cách nhấn "Xác nhận đặt cọc", bạn đồng ý ký kết Hợp đồng xác nhận đặt cọc điện tử và tuân thủ các điều khoản thuê trọ của StayVN.'
                    : 'Bằng cách nhấn "Đặt ngay", bạn đồng ý với các điều khoản bảo mật và chính sách hủy phòng của khách sạn.'}
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" defaultChecked />
                <label htmlFor="terms" className="text-xs font-medium cursor-pointer">
                  Tôi đã đọc và đồng ý với các điều khoản.
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handleBack} disabled={isSubmitting}>
                Quay lại
              </Button>
              <Button 
                className="flex-[2] h-12 rounded-xl font-bold" 
                onClick={handleBookNow}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : isMonthly ? "Xác nhận đặt cọc" : "Đặt ngay"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;
