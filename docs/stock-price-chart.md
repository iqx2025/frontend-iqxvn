# Stock Price Chart Component

## Tổng quan

Component `StockPriceChart` hiển thị biểu đồ giá cổ phiếu với dữ liệu lịch sử từ API Simplize. Component hỗ trợ nhiều loại biểu đồ và khoảng thời gian khác nhau.

## Tính năng

### 1. Nhiều loại biểu đồ
- **Vùng (Area)**: Biểu đồ vùng với gradient màu
- **Đường (Line)**: Biểu đồ đường đơn giản
- **Nến (Candlestick)**: Hiển thị giá cao, thấp, đóng cửa

### 2. Khoảng thời gian linh hoạt
- 1 Ngày (`1d`)
- 1 Tháng (`1m`) 
- 3 Tháng (`3m`)
- 1 Năm (`1y`)
- 5 Năm (`5y`)
- Tất cả (`all`)

### 3. Thống kê giá
- Giá hiện tại
- Giá cao nhất trong khoảng thời gian
- Giá thấp nhất trong khoảng thời gian
- Khối lượng giao dịch trung bình

### 4. Tương tác
- Tooltip chi tiết khi hover
- Chuyển đổi loại biểu đồ
- Chuyển đổi khoảng thời gian
- Nút refresh để tải lại dữ liệu

## Cách sử dụng

### Import component
```tsx
import StockPriceChart from '@/components/stock-price-chart';
```

### Sử dụng cơ bản
```tsx
<StockPriceChart 
  ticker="VIC" 
/>
```

### Sử dụng với tùy chọn
```tsx
<StockPriceChart 
  ticker="VIC"
  height={600}
  className="mb-8"
/>
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `ticker` | `string` | - | Mã cổ phiếu (bắt buộc) |
| `height` | `number` | `400` | Chiều cao biểu đồ (px) |
| `className` | `string` | `''` | CSS classes bổ sung |

## API Integration

Component sử dụng API Simplize để lấy dữ liệu:
```
https://api2.simplize.vn/api/historical/prices/chart?ticker={ticker}&period={period}
```

### Cấu trúc dữ liệu API
```json
{
  "status": 200,
  "message": "Success", 
  "data": [
    [timestamp, open, high, low, close, volume],
    ...
  ]
}
```

Trong đó:
- `timestamp`: Unix timestamp
- `open`: Giá mở cửa
- `high`: Giá cao nhất
- `low`: Giá thấp nhất  
- `close`: Giá đóng cửa
- `volume`: Khối lượng giao dịch

## Xử lý lỗi

Component có xử lý lỗi tích hợp:
- Hiển thị loading state khi đang tải dữ liệu
- Hiển thị thông báo lỗi khi không thể tải dữ liệu
- Nút "Thử lại" để tải lại dữ liệu

## Responsive Design

- Biểu đồ tự động điều chỉnh kích thước theo container
- Layout responsive cho các nút điều khiển
- Thống kê hiển thị dạng grid responsive

## Dependencies

- `recharts`: Thư viện biểu đồ React
- `@/services/api`: Service để gọi API
- `@/types`: Type definitions
- `@/components/ui/*`: UI components từ shadcn/ui

## Ví dụ tích hợp

```tsx
// Trong trang chi tiết cổ phiếu
export default function TickerPage({ params }: TickerPageProps) {
  const { ticker } = await params;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <StockBusinessProfile ticker={ticker} />
      
      <StockPriceChart 
        ticker={ticker}
        height={500}
        className="mb-8"
      />
      
      {/* Các section khác */}
    </div>
  );
}
```

## Tùy chỉnh

### Màu sắc
Màu sắc biểu đồ tự động thay đổi dựa trên xu hướng giá:
- Xanh lá (`#22c55e`): Giá tăng
- Đỏ (`#ef4444`): Giá giảm
- Xanh dương (`#3b82f6`): Đường đóng cửa trong biểu đồ nến

### Tooltip
Tooltip hiển thị thông tin chi tiết:
- Thời gian
- Giá mở cửa, cao nhất, thấp nhất, đóng cửa
- Khối lượng giao dịch

## Performance

- Sử dụng `ResponsiveContainer` để tối ưu rendering
- Lazy loading dữ liệu khi thay đổi ticker hoặc period
- Caching dữ liệu trong state để tránh gọi API không cần thiết
