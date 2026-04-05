import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, X } from "lucide-react";

import FilterSidebar from "@/components/FilterSidebar";
import hotelService from "@/api/hotelService";
import HotelCard from "@/components/HotelCard";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    keyword: searchParams.get("q") || "",
    maxPrice: searchParams.get("maxPrice") 
      ? parseInt(searchParams.get("maxPrice")!) 
      : 5000000,
    stars: searchParams.get("stars")
      ? searchParams.get("stars")!.split(",").map(Number)
      : [],
    minRating: searchParams.get("minRating")
      ? parseFloat(searchParams.get("minRating")!)
      : undefined,
    amenityIds: searchParams.get("amenities")
      ? searchParams.get("amenities")!.split(",").map(Number)
      : [],
  });

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };

      const params = new URLSearchParams();

      if (updated.keyword?.trim()) {
        params.set("q", updated.keyword.trim());
      }

      // MaxPrice: chỉ set khi có giá trị
      if (updated.maxPrice !== undefined && updated.maxPrice !== null) {
        params.set("maxPrice", updated.maxPrice.toString());
      }

      if (updated.stars && updated.stars.length > 0) {
        params.set("stars", updated.stars.join(","));
      }

      if (updated.minRating !== undefined) {
        params.set("minRating", updated.minRating.toString());
      }

      if (updated.amenityIds && updated.amenityIds.length > 0) {
        params.set("amenities", updated.amenityIds.join(","));
      }

      setSearchParams(params);
      return updated;
    });
  }, [setSearchParams]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const result = await hotelService.searchHotels(
        filters.keyword || null,
        filters.maxPrice,
        filters.stars,
        filters.minRating,
        filters.amenityIds
      );
      setHotels(result);
    } catch (err) {
      console.error("Search error:", err);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      performSearch();
    }, 400);
    return () => clearTimeout(timeout);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      {/* SEARCH BAR */}
      <div className="sticky top-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex gap-3 bg-gray-100 rounded-xl p-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input
                value={filters.keyword}
                onChange={(e) => updateFilters({ keyword: e.target.value })}
                placeholder="Tìm khách sạn..."
                className="flex-1 bg-transparent outline-none"
              />
              {filters.keyword && (
                <X
                  onClick={() => updateFilters({ keyword: "" })}
                  className="cursor-pointer"
                />
              )}
            </div>

            <button
              onClick={performSearch}
              className="bg-primary text-white px-4 rounded-lg"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 flex gap-8">
        
        {/* SIDEBAR */}
        <div className="hidden lg:block">
          <FilterSidebar onFilterChange={updateFilters} />
        </div>

        {/* RESULT */}
        <div className="flex-1">
          <h2 className="font-bold text-xl mb-4">
            {hotels.length} khách sạn
          </h2>

          {loading ? (
            <p>Đang tải...</p>
          ) : hotels.length === 0 ? (
            <p className="text-gray-500">Không tìm thấy khách sạn phù hợp với bộ lọc.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;