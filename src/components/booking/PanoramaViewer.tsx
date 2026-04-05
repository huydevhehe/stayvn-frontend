import React, { useEffect, useRef } from "react";

interface PanoramaViewerProps {
  imageUrl: string;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ imageUrl }) => {
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Thêm Pannellum CSS từ CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);

    // Thêm Pannellum JS từ CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).pannellum && viewerRef.current) {
        (window as any).pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: -2,
          showControls: true,
          mouseZoom: true,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      // Dọn dẹp script và link khi component unmount
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [imageUrl]);

  return (
    <div 
      ref={viewerRef} 
      className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-bold"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="animate-pulse opacity-50 tracking-widest uppercase text-xs">Đang tải không gian 360°...</p>
      </div>
    </div>
  );
};

export default PanoramaViewer;
