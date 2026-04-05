import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import hotelService from "@/api/hotelService";
import roomService from "@/api/roomService";
import {
  Hotel,
  Bed,
  Settings,
  Bath,
  Calendar,
  CreditCard,
  Star,
  ChevronRight,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

const navItems = [
  { 
    to: "/admin/hotels", 
    icon: Hotel, 
    label: "Khách sạn", 
    description: "Quản lý danh sách và thông tin khách sạn", 
    color: "bg-blue-500/10 text-blue-600",
    hoverColor: "group-hover:text-blue-600"
  },
  { 
    to: "/admin/room-types", 
    icon: Settings, 
    label: "Loại phòng", 
    description: "Định nghĩa các hạng phòng (Deluxe, Suite...)", 
    color: "bg-purple-500/10 text-purple-600",
    hoverColor: "group-hover:text-purple-600"
  },
  { 
    to: "/admin/rooms", 
    icon: Bed, 
    label: "Phòng", 
    description: "Quản lý chi tiết từng phòng và trạng thái", 
    color: "bg-green-500/10 text-green-600",
    hoverColor: "group-hover:text-green-600"
  },
  {
    to: "/admin/amenities",
    icon: Bath,
    label: "Tiện ích",
    description: "Quản lý danh mục tiện ích dịch vụ", 
    color: "bg-cyan-500/10 text-cyan-600",
    hoverColor: "group-hover:text-cyan-600"
  },
  { 
    to: "/admin/bookings", 
    icon: Calendar, 
    label: "Đặt phòng", 
    description: "Theo dõi và quản lý đơn đặt của khách", 
    color: "bg-orange-500/10 text-orange-600",
    hoverColor: "group-hover:text-orange-600"
  },
  { 
    to: "/admin/payments", 
    icon: CreditCard, 
    label: "Thanh toán", 
    description: "Theo dõi các giao dịch và doanh thu", 
    color: "bg-emerald-500/10 text-emerald-600",
    hoverColor: "group-hover:text-emerald-600"
  },
  { 
    to: "/admin/reviews", 
    icon: Star, 
    label: "Đánh giá", 
    description: "Xem và phản hồi ý kiến phản hồi", 
    color: "bg-yellow-500/10 text-yellow-600",
    hoverColor: "group-hover:text-yellow-600"
  },
];

function StatsCard({ title, value, icon: Icon, description, trend }: any) {
  return (
    <Card className="overflow-hidden relative border-none shadow-md bg-white/50 backdrop-blur-sm hover:translate-y-[-4px] transition-transform duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center">
          {trend && (
            <span className="text-emerald-500 font-medium flex items-center mr-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> {trend}
            </span>
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: hotels = [] } = useQuery({
    queryKey: ["hotels"],
    queryFn: hotelService.getHotels,
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: roomService.getRooms,
  });

  const stats = [
    { title: "Tổng khách sạn", value: hotels.length, icon: Hotel, description: "Cơ sở lưu trú", trend: "+12%" },
    { title: "Tổng số phòng", value: rooms.length, icon: Bed, description: "Trên tất cả hệ thống", trend: "+5%" },
    { title: "Tổng đơn đặt", value: "1,284", icon: Calendar, description: "Trong tháng này", trend: "+18%" },
    { title: "Doanh thu", value: "$42,500", icon: DollarSign, description: "Trong 30 ngày qua", trend: "+24%" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Chào mừng trở lại, Quản trị viên</h1>
        <p className="text-muted-foreground text-sm">Dưới đây là tình hình hoạt động hệ thống của bạn hôm nay.</p>
      </div>


      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Navigation */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Trung tâm quản lý</h2>
          <p className="text-sm text-muted-foreground">Truy cập nhanh vào các phân hệ</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="group">
              <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/40 backdrop-blur-md overflow-hidden relative group-hover:translate-y-[-8px]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rotate-12">
                  <item.icon className="w-32 h-32" />
                </div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className={`p-3 rounded-2xl ${item.color} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-all duration-300 group-hover:translate-x-1" />
                </CardHeader>
                <CardContent>
                  <CardTitle className={`text-xl font-bold mb-2 transition-colors duration-300 ${item.hoverColor}`}>
                    {item.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-6 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full opacity-60" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
