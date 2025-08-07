"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  Settings,
  Bell,
  Eye,
  TrendingUp,
  Calendar,
  Shield,
  Download
} from "lucide-react";
import { useState } from "react";

// Mock user data
const userData = {
  name: "Nguyễn Văn A",
  email: "nguyen.van.a@email.com",
  phone: "0123456789",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  memberSince: "2023-01-15",
  accountType: "Premium",
  avatar: null
};

// Mock watchlist
const watchlist = [
  { symbol: "VIC", name: "Vingroup", price: 45600, change: 2.71, alert: true },
  { symbol: "VCB", name: "Vietcombank", price: 89500, change: -0.56, alert: false },
  { symbol: "FPT", name: "FPT Corporation", price: 123400, change: 1.73, alert: true },
  { symbol: "VHM", name: "Vinhomes", price: 67800, change: -1.17, alert: false },
  { symbol: "MSN", name: "Masan Group", price: 78900, change: 1.94, alert: true },
];

// Mock alerts
const priceAlerts = [
  { symbol: "VIC", condition: "Giá > 46,000", status: "Hoạt động", created: "2025-01-05" },
  { symbol: "VCB", condition: "Giá < 88,000", status: "Đã kích hoạt", created: "2025-01-03" },
  { symbol: "FPT", condition: "RSI > 70", status: "Hoạt động", created: "2025-01-01" },
];

// Mock transaction history
const transactions = [
  { date: "2025-01-08", type: "Xem tin tức", description: "VN-Index tăng điểm trong phiên giao dịch sáng", time: "09:30" },
  { date: "2025-01-08", type: "Xem biểu đồ", description: "Phân tích kỹ thuật VIC", time: "09:15" },
  { date: "2025-01-07", type: "Thiết lập cảnh báo", description: "Cảnh báo giá VIC > 46,000", time: "16:45" },
  { date: "2025-01-07", type: "Xem tin tức", description: "Dòng vốn nước ngoài tiếp tục đổ vào Việt Nam", time: "14:20" },
  { date: "2025-01-06", type: "Thêm vào watchlist", description: "Thêm MSN vào danh sách theo dõi", time: "11:30" },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: User },
    { id: "watchlist", label: "Danh sách theo dõi", icon: Eye },
    { id: "alerts", label: "Cảnh báo", icon: Bell },
    { id: "settings", label: "Cài đặt", icon: Settings },
    { id: "activity", label: "Hoạt động", icon: TrendingUp },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tài khoản của tôi
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân và cài đặt tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              {/* User Avatar and Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-gray-600" />
                </div>
                <h3 className="font-semibold text-lg">{userData.name}</h3>
                <p className="text-sm text-gray-600">{userData.email}</p>
                <Badge className="mt-2">{userData.accountType}</Badge>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Họ và tên</label>
                    <Input defaultValue={userData.name} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input defaultValue={userData.email} type="email" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Số điện thoại</label>
                    <Input defaultValue={userData.phone} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ngày tham gia</label>
                    <Input defaultValue={userData.memberSince} disabled />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Địa chỉ</label>
                  <Input defaultValue={userData.address} />
                </div>
                <div className="flex gap-4">
                  <Button>Lưu thay đổi</Button>
                  <Button variant="outline">Hủy</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Watchlist Tab */}
          {activeTab === "watchlist" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Danh sách theo dõi
                </CardTitle>
                <CardDescription>
                  Các mã chứng khoán bạn đang theo dõi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã CK</TableHead>
                      <TableHead>Tên công ty</TableHead>
                      <TableHead className="text-right">Giá</TableHead>
                      <TableHead className="text-right">Thay đổi</TableHead>
                      <TableHead>Cảnh báo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {watchlist.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell className="text-right">{stock.price.toLocaleString()}</TableCell>
                        <TableCell className={`text-right ${stock.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </TableCell>
                        <TableCell>
                          {stock.alert ? (
                            <Badge variant="default">Bật</Badge>
                          ) : (
                            <Badge variant="secondary">Tắt</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Xóa</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button>Thêm mã mới</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts Tab */}
          {activeTab === "alerts" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Cảnh báo giá
                </CardTitle>
                <CardDescription>
                  Quản lý các cảnh báo giá và tín hiệu kỹ thuật
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã CK</TableHead>
                      <TableHead>Điều kiện</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceAlerts.map((alert, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{alert.symbol}</TableCell>
                        <TableCell>{alert.condition}</TableCell>
                        <TableCell>
                          <Badge variant={alert.status === "Hoạt động" ? "default" : "secondary"}>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.created}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Sửa</Button>
                            <Button variant="outline" size="sm">Xóa</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4">
                  <Button>Tạo cảnh báo mới</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email thông báo</h4>
                      <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
                    </div>
                    <Button variant="outline" size="sm">Bật</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Thông báo đẩy</h4>
                      <p className="text-sm text-gray-600">Nhận thông báo trên trình duyệt</p>
                    </div>
                    <Button variant="outline" size="sm">Tắt</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Báo cáo hàng tuần</h4>
                      <p className="text-sm text-gray-600">Nhận báo cáo tổng hợp hàng tuần</p>
                    </div>
                    <Button variant="outline" size="sm">Bật</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Xác thực 2 bước
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống dữ liệu
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Hoạt động gần đây
                </CardTitle>
                <CardDescription>
                  Lịch sử hoạt động của bạn trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{transaction.type}</h4>
                          <span className="text-sm text-gray-500">{transaction.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline">Xem thêm</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
