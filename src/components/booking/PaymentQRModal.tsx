import React from "react";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Download, ExternalLink, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onPaid: () => void;
}

const PaymentQRModal: React.FC<PaymentQRModalProps> = ({ isOpen, onClose, booking, onPaid }) => {
  const [selectedOption, setSelectedOption] = React.useState<"DEPOSIT" | "FULL">("DEPOSIT");
  const [confirming, setConfirming] = React.useState(false);

  if (!booking) return null;

  const amount = selectedOption === "DEPOSIT" ? booking.depositAmount : booking.totalPrice;
  
  // VietQR API: https://api.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
  const qrUrl = `https://api.vietqr.io/image/${booking.bankCode}-${booking.bankAccountNumber}-compact.png?amount=${amount}&addInfo=STVNBK${booking.id}&accountName=${encodeURIComponent(booking.bankAccountName || "")}`;

  const handleConfirm = async () => {
    setConfirming(true);
    // Simulate API call to update status to PENDING_CONFIRMATION
    try {
        // Here we would call bookingService.confirmPayment(booking.id)
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Đã gửi yêu cầu xác nhận thanh toán tới bộ phận quản lý!");
        onPaid();
        onClose();
    } catch (error) {
        toast.error("Có lỗi xảy ra khi gửi xác nhận.");
    } finally {
        setConfirming(false);
    }
  };

  const formatVND = (n: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán đơn đặt phòng">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
        
        {/* Payment Options */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedOption("DEPOSIT")}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              selectedOption === "DEPOSIT" 
                ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Cọc trước 20%</p>
            <p className="text-xl font-black text-slate-800">{formatVND(booking.depositAmount)}</p>
          </button>
          
          <button
            onClick={() => setSelectedOption("FULL")}
            className={`p-4 rounded-2xl border-2 transition-all text-left ${
              selectedOption === "FULL" 
                ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Thanh toán 100%</p>
            <p className="text-xl font-black text-slate-800">{formatVND(booking.totalPrice)}</p>
          </button>
        </div>

        {/* QR Code Section */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 flex flex-col items-center gap-6 border border-slate-100 shadow-inner group">
          {!booking.bankCode || !booking.bankAccountNumber ? (
            <div className="py-12 text-center space-y-4">
               <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
               <p className="font-bold text-slate-600 max-w-[250px]">Chủ khách sạn chưa cập nhật thông tin ngân hàng.</p>
               <p className="text-sm text-slate-400">Vui lòng liên hệ trực tiếp để được hỗ trợ.</p>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700" />
                <div className="relative bg-white p-4 rounded-3xl shadow-xl overflow-hidden">
                  <img src={qrUrl} alt="QR Thanh toán" className="w-64 h-64 object-contain" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">{booking.bankName}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-black tracking-tighter text-primary">{booking.bankAccountNumber}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
                    navigator.clipboard.writeText(booking.bankAccountNumber);
                    toast.success("Đã copy số tài khoản!");
                  }}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{booking.bankAccountName}</p>
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-4 flex gap-4 border border-blue-100">
           <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
           <div className="space-y-1">
             <p className="text-sm font-bold text-blue-900">Hướng dẫn thanh toán</p>
             <p className="text-xs text-blue-700 leading-relaxed">
               Quét mã QR bằng ứng dụng ngân hàng của bạn. Số tiền và nội dung sẽ được tự động điền. 
               Sau đó, nhấn nút <b>"Tôi đã chuyển khoản"</b> để thông báo cho chúng tôi.
             </p>
           </div>
        </div>

        {/* Action Button */}
        <Button 
          disabled={confirming || !booking.bankAccountNumber}
          onClick={handleConfirm}
          className="w-full h-16 rounded-[1.5rem] bg-slate-900 hover:bg-black text-white font-black text-lg gap-3 shadow-2xl shadow-slate-900/20 active:scale-[0.98] transition-all"
        >
          {confirming ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" /> Tôi đã chuyển khoản
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default PaymentQRModal;
