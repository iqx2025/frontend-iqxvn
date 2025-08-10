# TradingView UDF-Compatible Datafeed (Backend Spec)

Tài liệu mô tả các API backend cần triển khai để thay thế demo_feed.tradingview.com bằng datafeed riêng, tương thích chuẩn UDF (Universal Data Feed) cho TradingView Charting Library.

- Chuẩn: UDF Compatible Datafeed (REST)
- Đối tượng sử dụng: Adapter `Datafeeds.UDFCompatibleDatafeed` trên frontend
- Ngôn ngữ: JSON (trừ `/time` trả text/plain)
- Base URL ví dụ: `/api/tv` (bạn có thể đổi theo hạ tầng của mình)

Lưu ý quan trọng
- Múi giờ: Sử dụng UTC cho mốc thời gian
- Đơn vị thời gian:
  - Request `/history`: `from` và `to` là UNIX timestamp (giây)
  - Response `/history`: mảng `t` là UNIX timestamp (giây)
  - Endpoint `/time`: trả thời gian UNIX (giây), text/plain
- Nến ngày/tuần/tháng: `t` nên đặt về 00:00:00 UTC của ngày giao dịch
- CORS: Cho phép origin của webapp nếu backend tách riêng
- Cache: Khuyến nghị dùng Cache-Control/ETag cho dải lịch sử cũ

---

## 1) GET /config (bắt buộc)
Mô tả khả năng của datafeed.

Ví dụ: GET /api/tv/config

Response 200 (application/json):
{
  "supports_search": true,
  "supports_group_request": false,
  "supports_marks": false,
  "supports_timescale_marks": false,
  "supports_time": true,
  "exchanges": [{ "value": "", "name": "All", "desc": "" }],
  "symbols_types": [{ "name": "All", "value": "" }],
  "supported_resolutions": ["1","5","15","30","60","120","240","D","W","M"]
}

Ghi chú
- `supported_resolutions`: khớp với các khung thời gian bạn hỗ trợ trong `/history`
- `supports_time=true`: cho phép adapter đồng bộ realtime dựa vào `/time`

---

## 2) GET /symbols (bắt buộc)
Trả metadata cho 1 symbol.

Query
- `symbol` (string): mã cần tra cứu (VD: `AAPL`, `VNINDEX`, `VIC`)

Ví dụ: GET /api/tv/symbols?symbol=AAPL

Response 200 (application/json):
{
  "name": "AAPL",
  "ticker": "AAPL",
  "description": "Apple Inc",
  "type": "stock",
  "session": "0930-1600",
  "timezone": "America/New_York",
  "exchange": "NASDAQ",
  "minmov": 1,
  "pricescale": 100,
  "has_intraday": true,
  "supported_resolutions": ["1","5","15","60","240","D","W","M"],
  "has_no_volume": false
}

Giải thích trường
- `pricescale`: hệ số chuyển đổi giá sang integer. VD: 100 -> 2 chữ số thập phân (168.34 -> 16834)
- `minmov`: bước giá tối thiểu tính theo đơn vị `pricescale`
- `session`: phiên giao dịch HHMM-HHMM (có thể nhiều đoạn, ví dụ VN: `0900-1130,1300-1500`)
- `has_no_volume`: true nếu symbol không có khối lượng

---

## 3) GET /search (bắt buộc nếu supports_search=true)
Phục vụ ô search symbol trên CL.

Query
- `query` (string): từ khóa tìm kiếm (không phân biệt hoa thường)
- `type` (string, optional): lọc theo loại (stock, index, crypto,…)
- `exchange` (string, optional): sàn
- `limit` (number, optional): số lượng tối đa

Ví dụ: GET /api/tv/search?query=AA&limit=10

Response 200 (application/json):
[
  {
    "symbol": "AAPL",
    "full_name": "NASDAQ:AAPL",
    "description": "Apple Inc",
    "exchange": "NASDAQ",
    "ticker": "AAPL",
    "type": "stock"
  }
]

---

## 4) GET /history (bắt buộc)
Trả dữ liệu OHLCV theo khoảng thời gian và độ phân giải.

Query
- `symbol` (string)
- `resolution` (string): một trong `supported_resolutions` (VD: "1","5","15","60","240","D","W","M")
- `from` (number): UNIX time (giây) – biên trái
- `to` (number): UNIX time (giây) – biên phải
- Optional nâng cao: `countback` (số lượng nến cần), nếu cung cấp có thể ưu tiên hơn `from/to`

Ví dụ: GET /api/tv/history?symbol=AAPL&resolution=60&from=1733376000&to=1733462400

Response 200 khi có dữ liệu:
{
  "s": "ok",
  "t": [1733376000, 1733379600, 1733383200],
  "o": [168.1, 168.5, 169.0],
  "h": [169.2, 169.7, 170.1],
  "l": [167.8, 168.2, 168.9],
  "c": [168.5, 169.0, 169.8],
  "v": [1200000, 980000, 1120000]
}

Response 200 khi không có dữ liệu trong khoảng:
{
  "s": "no_data",
  "nextTime": 1733476800
}

Quy tắc quan trọng
- `t`/`o`/`h`/`l`/`c`/`v` phải cùng chiều dài và cùng index
- `t` là UNIX giây (UTC); với D/W/M thì là 00:00 UTC ngày giao dịch
- Sắp xếp tăng dần theo thời gian
- `no_data` + `nextTime`: gợi ý điểm bắt đầu có dữ liệu tiếp theo

---

## 5) GET /time (bắt buộc nếu supports_time=true)
Trả thời gian server hiện tại, phục vụ đồng bộ realtime bằng polling.

Ví dụ: GET /api/tv/time

Response 200 (text/plain)
1733462400

Ghi chú
- Trả đơn giản là một số (UNIX giây), không có JSON

---

## 6) GET /marks (tùy chọn)
Đánh dấu điểm sự kiện (ví dụ tin tức, cổ tức).

Query
- `symbol` (string)
- `from` (UNIX giây)
- `to` (UNIX giây)

Response 200 (application/json):
[
  {
    "id": 1,
    "time": 1733400000,
    "color": "red",
    "text": "Earnings",
    "label": "E",
    "labelFontColor": "white",
    "minSize": 14
  }
]

---

## 7) GET /timescale_marks (tùy chọn)
Đánh dấu theo trục thời gian (scale), thường ít dùng.

Query
- `symbol` (string)
- `from` (UNIX giây)
- `to` (UNIX giây)
- `resolution` (string)

Response 200:
[
  {
    "id": 1,
    "time": 1733400000,
    "color": "#999",
    "label": "D",
    "tooltip": ["Dividend", "0.50"]
  }
]

---

## 8) GET /quotes (tùy chọn)
Cung cấp báo giá nhanh cho Trading Terminal. Không bắt buộc cho biểu đồ cơ bản.

Query
- `symbols` (comma-separated): VD: `AAPL,MSFT,VNINDEX`

Ví dụ: GET /api/tv/quotes?symbols=AAPL,MSFT

Response 200 (application/json):
{
  "s": "ok",
  "d": [
    {
      "s": "AAPL",
      "n": "AAPL",
      "v": {
        "lp": 169.8,       
        "ch": -1.2,        
        "chp": -0.7,       
        "bid": 169.7,
        "ask": 169.8,
        "volume": 38960000,
        "open_price": 171.0,
        "high_price": 172.0,
        "low_price": 168.0
      }
    }
  ]
}

Ghi chú
- Cấu trúc trường `v` linh hoạt; CL chủ yếu dùng `lp` (last price), `ch`, `chp`, `volume`

---

## Mapping độ phân giải (khuyến nghị)
- "1"  -> 1 phút
- "5"  -> 5 phút
- "15" -> 15 phút
- "30" -> 30 phút
- "60" -> 60 phút
- "120"-> 120 phút
- "240"-> 240 phút
- "D"  -> ngày
- "W"  -> tuần
- "M"  -> tháng

### Gợi ý tổng hợp nến server-side
- Lưu dữ liệu hạt nhỏ (vd: 1m hoặc tick) → tổng hợp thành các độ phân giải lớn hơn
- Với daily/week/month: căn mốc 00:00 UTC; chú ý phiên VN (giờ địa phương) và ngày nghỉ

---

## Quy tắc trả về & lỗi
- 200 + body JSON hợp lệ với `s: "ok"` hoặc `s: "no_data"`
- 4xx cho tham số sai; 5xx cho lỗi hệ thống
- Content-Type: application/json (trừ `/time`)

Ví dụ lỗi tham số thiếu (400):
{
  "error": "Missing required parameter: symbol"
}

---

## Caching & hiệu năng
- Dải lịch sử cũ: `Cache-Control: public, max-age=...` hoặc ETag để giảm tải
- Dải gần hiện tại: giảm cache hoặc max-age thấp
- Có thể thêm `countback` để giới hạn số nến trả về theo nhu cầu UI

---

## Bảo mật & triển khai
- Nếu backend tách domain: bật CORS cho origin frontend
- Nếu cần auth: cân nhắc đặt datafeed cùng origin (proxy) để tránh custom headers (UDF adapter khó thêm header)
- Rate limiting: áp dụng theo IP/key nếu API public

---

## Checklist tích hợp
- [ ] Triển khai: /config, /symbols, /search, /history, /time
- [ ] (Tùy chọn) /marks, /timescale_marks, /quotes
- [ ] Kết nối nguồn dữ liệu & tổng hợp OHLCV theo resolution
- [ ] Chuẩn hóa thời gian UTC; daily candle 00:00 UTC
- [ ] Áp dụng cache cho dải lịch sử cũ
- [ ] Trỏ frontend UDFCompatibleDatafeed sang base URL backend mới

---

## Ví dụ nhanh thay URL trên frontend
Trong file nơi khởi tạo datafeed:

```ts
new (window as any).Datafeeds.UDFCompatibleDatafeed(
  "/api/tv",
  undefined,
  { maxResponseLength: 1000, expectedOrder: "latestFirst" }
)
```

---

## Phụ lục: Trường phổ biến trong /symbols
- `pricescale` ví dụ:
  - 1   → 0 chữ số thập phân (giá nguyên)
  - 100 → 2 chữ số (168.34 → 16834)
  - 1000→ 3 chữ số
- `minmov` (bước giá) ví dụ:
  - 1: bước nhỏ nhất = 1 unit (theo pricescale)
  - 5: bước = 5 units (theo pricescale)
- `has_no_volume = true` nếu index không có volume

Kết thúc.

