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
  monthlyRentals?: MonthlyRental[];
  monthlyRooms?: MonthlyRental[]; // Biệt danh để khớp với Detail.tsx
  reviews?: Review[];

  rating?: number;
  rooms?: Room[];
}

export interface RoomType {
  id: number;
  hotelId?: number;
  name: string;
  pricePerNight: number;
  capacity: number;

  image?: string;
  imageUrl?: string;
  images?: Array<{ imageUrl: string; is360?: boolean }>;

  bed?: string;
  bedType?: string;
  price?: number;
  left?: number;
  refundPolicy?: string;
  availableRooms?: number;
}

export type MonthlyRoom = MonthlyRental;

export interface MonthlyRental {
  id: number;
  name: string;
  address: string;
  area: number;
  monthlyPrice: number;
  deposit: number;
  utilities: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  minContractMonths: number;
  electricityPrice?: number;
  waterPrice?: number;
  wifiPrice?: number;
  description?: string;
  terms?: string;
  imageUrls?: string[];
  images?: Array<{ id: number; imageUrl: string }>;
}

export interface MonthlyBooking {
  id: number;
  userId: number;
  userName: string;
  rentalId: number;
  rentalName: string;
  address: string;
  startDate: string;
  contractMonths: number;
  monthlyPrice: number;
  depositAmount: number;
  status: string;
  contractContent: string;
  createdAt: string;
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  content?: string;
  userName?: string;
  avatar?: string;
  createdAt?: string;
  helpful?: number;
  status?: string;
}

export interface CreateHotelRequest {
  name: string;
  address: string;
  starRating: number;
  description?: string;
  minPrice?: number;
}

export interface UpdateHotelRequest {
  name: string;
  address: string;
  starRating: number;
  description?: string;
  minPrice?: number;
}

export interface CreateRoomTypeRequest {
  hotelId: number;
  name: string;
  pricePerNight: number;
  capacity: number;
}

export interface Room {
  id: number;
  roomTypeId: number;
  roomNumber: string;
  status: string;
}

export interface CreateRoomRequest {
  roomTypeId: number;
  roomNumber: string;
}

export interface UpdateRoomStatusRequest {
  status: string;
}

export interface RoomPrice {
  id: number;
  roomTypeId: number;
  priceDate: string;
  price: number;
}

export interface CreateRoomPriceRequest {
  roomTypeId: number;
  priceDate: string;
  price: number;
}

export interface Booking {
  id: number;
  userId: number;
  roomId: number;
  hotelId: number;
  hotelName?: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  totalPrice?: number;
  isResale?: boolean;
  isResalePurchase?: boolean;
  resalePrice?: number;
  resaleMessage?: string;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  RESALE = "RESALE",
}

export interface CreateBookingRequest {
  userId: number;
  roomId: number;
  hotelId: number;
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingStatusUpdateRequest {
  status: BookingStatus;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  paymentMethod: string;
  status: string;
}

export interface UpdatePaymentStatusRequest {
  status: string;
}

export interface UpdateReviewStatusRequest {
  status: string;
}

export interface CancellationPolicy {
  id: number;
  hotelId: number;
  policyDetails: string;
}

export interface CreateCancellationPolicyRequest {
  policyDetails: string;
}

export interface Amenity {
  id: number;
  name: string;
}

export interface RoomKey {
  id: number;
  bookingId: number;
  roomNumber: string;
  hotelName: string;
  accessCode: string;
  expiryDate: string;
  isActive: boolean;
}