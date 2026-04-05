import { Room } from "./admin";

export interface Hotel {
  id: number;
  name: string;
  address: string;
  starRating: number;
  averageRating?: number;
  reviewCount?: number;
  minPrice?: number;
  description?: string;
  imageUrls?: string[];
  amenities?: any[];

  roomTypes?: RoomType[];
  monthlyRooms?: MonthlyRoom[];

  rating?: number;
}

export interface RoomType {
  id: number;
  name: string;
  pricePerNight: number;
  capacity: number;

  imageUrl?: string;
  images?: Array<{ imageUrl: string; is360?: boolean }>;

  bed?: string;
  bedType?: string;
  price?: number;
  left?: number;
  refundPolicy?: string;
  availableRooms?: number;
  rooms?: Room[];
}

// MonthlyRoom và Review giữ nguyên...
export interface MonthlyRoom {
  id?: number;
  name: string;
  area?: number;
  monthlyPrice: number;
  deposit: number;
  utilities: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
}
