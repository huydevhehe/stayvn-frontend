import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Star, X } from "lucide-react";
import amenityService from "@/api/amenityService";
import { useSearchParams } from "react-router-dom";   // ← Thêm import này

interface FilterSidebarProps {
  onFilterChange: (filters: any) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const [searchParams] = useSearchParams();   // ← Đọc từ URL

  const [price, setPrice] = useState<number>(
    searchParams.get("maxPrice") ? parseInt(searchParams.get("maxPrice")!) : 5000000
  );
  
  const [selectedStar, setSelectedStar] = useState<number | null>(
    searchParams.get("stars") ? parseInt(searchParams.get("stars")!) : null
  );

  const [guestRatings, setGuestRatings] = useState<number[]>(
    searchParams.get("minRating") 
      ? [parseFloat(searchParams.get("minRating")!)] 
      : []
  );

  const [amenities, setAmenities] = useState<number[]>(
    searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",").map(Number)
      : []
  );

  const [amenityList, setAmenityList] = useState<any[]>([]);

  // Fetch amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const data = await amenityService.getAmenities();
        setAmenityList(data);
      } catch (err) {
        console.error("Load amenities failed", err);
      }
    };
    fetchAmenities();
  }, []);

  const updateFilters = (newFilters: any) => {
    onFilterChange(newFilters);
  };

  // ================== PRICE ==================
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPrice(value);
    updateFilters({ maxPrice: value });
  };

  const resetPrice = () => {
    setPrice(5000000);
    updateFilters({ maxPrice: undefined });
  };

  // ================== STAR (Chỉ chọn 1 sao) ==================
  const handleStarChange = (star: number) => {
    const newStar = selectedStar === star ? null : star;
    setSelectedStar(newStar);
    updateFilters({ stars: newStar ? [newStar] : [] });
  };

  // ================== RATING ==================
  const handleRatingChange = (rating: number) => {
    const newRatings = guestRatings.includes(rating)
      ? guestRatings.filter((r) => r !== rating)
      : [...guestRatings, rating];

    setGuestRatings(newRatings);
    const minRating = newRatings.length > 0 ? Math.min(...newRatings) : undefined;
    updateFilters({ minRating });
  };

  // ================== AMENITIES ==================
  const toggleAmenity = (id: number) => {
    const newAmenities = amenities.includes(id)
      ? amenities.filter((a) => a !== id)
      : [...amenities, id];

    setAmenities(newAmenities);
    updateFilters({ amenityIds: newAmenities });
  };

  return (
    <div className="w-full lg:w-72 space-y-8 p-6 bg-white rounded-2xl shadow sticky top-24">
      
      {/* PRICE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Lọc theo giá</h3>
          {price < 5000000 && (
            <button
              onClick={resetPrice}
              className="text-xs flex items-center gap-1 text-red-500 hover:text-red-600"
            >
              <X size={14} /> Reset
            </button>
          )}
        </div>

        <input
          type="range"
          min="500000"
          max="5000000"
          step="100000"
          value={price}
          onChange={handlePriceChange}
          className="w-full accent-primary"
        />

        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">500k</span>
          <span className="text-primary font-semibold">
            Tối đa: {price.toLocaleString()}₫
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Chỉ hiển thị khách sạn có giá ≤ {price.toLocaleString()}₫
        </p>
      </div>

      <Separator />

      {/* STAR - Chỉ chọn 1 sao */}
      <div>
        <h3 className="font-bold mb-3">Xếp hạng sao</h3>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const isActive = selectedStar === star;
            return (
              <button
                key={star}
                onClick={() => handleStarChange(star)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded border text-sm transition-all
                  ${isActive 
                    ? "bg-primary text-white border-primary" 
                    : "bg-white hover:bg-gray-50"
                  }`}
              >
                {star} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </button>
            );
          })}
        </div>
        {selectedStar && (
          <p className="text-xs text-gray-500 mt-2">
            Chỉ hiển thị khách sạn {selectedStar} sao
          </p>
        )}
      </div>

      <Separator />

      {/* RATING */}
      <div>
        <h3 className="font-bold mb-3">Đánh giá khách hàng</h3>
        <div className="flex gap-2 flex-wrap">
          {[9, 8, 7].map((r) => {
            const active = guestRatings.includes(r);
            return (
              <button
                key={r}
                onClick={() => handleRatingChange(r)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all
                  ${active ? "bg-primary text-white border-primary" : "hover:bg-gray-50"}
                `}
              >
                {r}+ 
              </button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* AMENITIES - Lấy từ API thật */}
      <div>
        <h3 className="font-bold mb-3">Tiện ích</h3>
        <div className="flex flex-wrap gap-2">
          {amenityList.map((a) => {
            const active = amenities.includes(a.id);
            return (
              <button
                key={a.id}
                onClick={() => toggleAmenity(a.id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-all
                  ${active ? "bg-primary text-white border-primary" : "hover:bg-gray-50"}
                `}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;