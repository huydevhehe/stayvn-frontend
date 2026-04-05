import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Zap, Unlock, Lock, Tablet } from "lucide-react";
import { RoomKey } from "../../types/admin";

interface DigitalKeyCardProps {
  roomKey: RoomKey;
}

const DigitalKeyCard: React.FC<DigitalKeyCardProps> = ({ roomKey }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUnlock = () => {
    if (isUnlocking || isSuccess) return;
    
    setIsUnlocking(true);
    // Giả lập quá trình kết nối và mở khóa
    setTimeout(() => {
      setIsUnlocking(false);
      setIsSuccess(true);
      // Sau 3 giây reset về trạng thái ban đầu
      setTimeout(() => setIsSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6">
      {/* THẺ TỪ GLASSMORPHISM */}
      <motion.div 
        initial={{ rotateY: -15, opacity: 0, y: 20 }}
        animate={{ rotateY: 0, opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-72 h-[420px] rounded-3xl overflow-hidden shadow-2xl group"
      >
        {/* Background Gradient & Glass */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          isSuccess ? "bg-gradient-to-br from-emerald-600 to-teal-800" : "bg-gradient-to-br from-slate-800 via-slate-900 to-black"
        }`} />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10" />
        
        {/* Nội dung trên thẻ */}
        <div className="relative h-full flex flex-col p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">Digital Room Key</p>
              <h3 className="text-xl font-black tracking-tight">{roomKey.hotelName}</h3>
            </div>
            <motion.div
              animate={isUnlocking ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Zap className={isSuccess ? "text-yellow-400" : "text-blue-400"} size={24} />
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col items-center">
            <div className="relative">
              {/* Animation Sóng NFC */}
              <AnimatePresence>
                {isUnlocking && (
                  <>
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute inset-0 rounded-full border-2 border-blue-400/30"
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${
                isSuccess ? "border-emerald-400 bg-emerald-400/20 shadow-[0_0_30px_rgba(52,211,153,0.5)]" : 
                isUnlocking ? "border-blue-400 bg-blue-400/10" : "border-white/20 bg-white/5"
              }`}>
                {isSuccess ? <Unlock size={48} className="text-emerald-400" /> : <Lock size={48} className="opacity-50" />}
              </div>
            </div>
            <p className="mt-6 text-sm font-medium opacity-80">
              {isSuccess ? "Cửa đã mở" : isUnlocking ? "Đang kết nối..." : "Chạm thẻ để mở cửa"}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] uppercase opacity-50 mb-1">Room Number</p>
              <p className="text-2xl font-bold tracking-widest">{roomKey.roomNumber}</p>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] uppercase opacity-50">Access Code</p>
                <p className="text-lg font-mono font-bold tracking-wider">{roomKey.accessCode}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] uppercase opacity-50">Expires</p>
                <p className="text-[10px] font-medium">{new Date(roomKey.expiryDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* NÚT THAO TÁC */}
      <button 
        onClick={handleUnlock}
        disabled={isUnlocking || isSuccess}
        className={`px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all transform active:scale-95 ${
          isSuccess ? "bg-emerald-500 text-white" : 
          isUnlocking ? "bg-slate-200 text-slate-500 cursor-wait" : 
          "bg-black text-white hover:bg-slate-800 shadow-xl hover:shadow-2xl"
        }`}
      >
        <Smartphone size={20} />
        {isSuccess ? "ĐÃ MỞ KHÓA" : isUnlocking ? "ĐANG QUÉT NFC..." : "BẬT KHÓA ĐIỆN TỬ"}
      </button>

      <p className="text-xs text-muted-foreground italic flex items-center gap-1.5 opacity-60">
        <Tablet size={12} /> Đưa điện thoại lại gần ổ khóa để sử dụng tính năng NFC
      </p>
    </div>
  );
};

export default DigitalKeyCard;
