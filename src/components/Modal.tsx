import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className="bg-card w-full max-w-xl rounded-2xl shadow-2xl border-none animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
            <div className="h-1 w-12 bg-primary mt-1 rounded-full" />
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
