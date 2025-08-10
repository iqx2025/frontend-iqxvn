# TradingView UDF-Compatible Datafeed (IQX)

This document describes the backend endpoints exposed by IQX to power TradingView's Charting Library via the Universal Data Feed (UDF) REST protocol.

- Compatibility: TradingView Charting Library `Datafeeds.UDFCompatibleDatafeed`
- Base URL: `/api/tv`
- Transport: HTTP(S), JSON (except `/time` which returns `text/plain`)
- Timezone: All timestamps are UTC seconds
- Data granularity: Daily only; Weekly and Monthly are aggregated server-side from daily bars

## Overview

- Supported resolutions: `D`, `W`, `M`
- Not supported: intraday resolutions (e.g., 1, 5, 15, 60 minutes)
- Daily bars are anchored to 00:00:00 UTC for each trading date
- Volume is provided when available; indices may have `has_no_volume: true` in symbols metadata (future enhancement)

## Quick Start (Frontend)

```
new (window as any).Datafeeds.UDFCompatibleDatafeed(
  '/api/tv',
  undefined,
  { maxResponseLength: 1000, expectedOrder: 'latestFirst' }
);
```

## Endpoints

All endpoints are relative to the base URL `/api/tv`.

### 1) GET /config
Describes datafeed capabilities.

Response 200 (application/json):
```
{
  "supports_search": true,
  "supports_group_request": false,
  "supports_marks": false,
  "supports_timescale_marks": false,
  "supports_time": true,
  "exchanges": [{ "value": "", "name": "All", "desc": "" }],
  "symbols_types": [{ "name": "All", "value": "" }],
  "supported_resolutions": ["D","W","M"]
}
```

Notes
- `supported_resolutions` matches the backend support (D/W/M only)
- `supports_time = true` enables /time polling

### 2) GET /symbols
Returns metadata for a single symbol.

Query
- `symbol` (string): e.g., `VIC`, `VNINDEX`

Response 200 (application/json):
```
{
  "name": "VIC",
  "ticker": "VIC",
  "description": "Vingroup",
  "type": "stock",
  "session": "0900-1130,1300-1500",
  "timezone": "Asia/Ho_Chi_Minh",
  "exchange": "HOSE",
  "minmov": 1,
  "pricescale": 100,
  "has_intraday": false,
  "supported_resolutions": ["D","W","M"],
  "has_no_volume": false
}
```

Field notes
- `pricescale`: 100 => 2 decimals (e.g., 168.34 -> 16834)
- `minmov`: minimal price movement in `pricescale` units (1 by default)
- `session`: VN example, adjust per exchange if needed

### 3) GET /search
Search symbols for the TradingView search UI.

Query
- `query` (string): case-insensitive search
- `type` (string, optional)
- `exchange` (string, optional)
- `limit` (number, optional, default 10, max 50)

Response 200 (application/json):
```
[
  {
    "symbol": "VIC",
    "full_name": "HOSE:VIC",
    "description": "Vingroup",
    "exchange": "HOSE",
    "ticker": "VIC",
    "type": "stock"
  }
]
```

### 4) GET /history
Returns OHLCV bars for a symbol over a time range and resolution.

Query
- `symbol` (string)
- `resolution` (string): one of `D`, `W`, `M`
- `from` (number): UNIX time (seconds, UTC) inclusive
- `to` (number): UNIX time (seconds, UTC) inclusive
- `countback` (number, optional): number of most recent bars; if provided, can supersede `from/to`

Response 200 with data:
```
{
  "s": "ok",
  "t": [1733376000, 1733462400],
  "o": [168.1, 169.0],
  "h": [170.2, 171.0],
  "l": [167.8, 168.5],
  "c": [169.0, 170.4],
  "v": [1200000, 980000]
}
```

Response 200 with no data:
```
{
  "s": "no_data",
  "nextTime": 1733558800
}
```

Rules
- Arrays `t/o/h/l/c/v` must have equal length and matching indices
- `t` are UNIX seconds (UTC). For D/W/M, timestamps are 00:00:00 UTC for the bucket date
- Results are sorted ascending by time
- `no_data` + `nextTime` hints the next available timestamp if known

Resolution mapping
- `D`: daily bars from table `price_history`
- `W`: server-side aggregation from daily (week buckets via `date_trunc('week')`)
- `M`: server-side aggregation from daily (month buckets via `date_trunc('month')`)

### 5) GET /time
Returns server time for realtime sync via polling.

Response 200 (text/plain):
```
1733462400
```

### 6) GET /marks (optional)
Event marks (news, dividends). Currently returns an empty array.

Query
- `symbol` (string)
- `from` (UNIX seconds)
- `to` (UNIX seconds)

Response 200 (application/json):
```
[]
```

### 7) GET /timescale_marks (optional)
Scale marks (less common). Currently returns an empty array.

Query
- `symbol` (string)
- `from` (UNIX seconds)
- `to` (UNIX seconds)
- `resolution` (string)

Response 200 (application/json):
```
[]
```

### 8) GET /quotes (optional)
Quick quotes for Trading Terminal (not required for basic charts).

Query
- `symbols` (comma-separated): e.g., `VIC,VCB,VNINDEX`

Response 200 (application/json):
```
{
  "s": "ok",
  "d": [
    {
      "s": "VIC",
      "n": "VIC",
      "v": {
        "lp": 170.4,
        "ch": 1.2,
        "chp": 0.71,
        "volume": 980000,
        "open_price": 169.0,
        "high_price": 171.0,
        "low_price": 168.5
      }
    }
  ]
}
```

Notes
- The structure of `v` is flexible. The library mostly uses `lp`, `ch`, `chp`, and `volume`.
- Data is sourced from table `companies` (last close, change, volume, OHL).

## Database & Data Mapping

- Daily source: `price_history` (columns: ticker, trade_date, open_price, high_price, low_price, close_price, match_volume, negotiated_volume, ...)
- `history` endpoint computes `v` as `match_volume + negotiated_volume` (if both available)
- Weekly/Monthly are computed with SQL using `date_trunc('week'|'month')` aggregations
- `t` is generated at 00:00:00 UTC of the aggregated bucket
- Quotes source: `companies` for recent prices and volume

## Error Handling

- 200 + `{ s: 'ok', ... }` when data exists
- 200 + `{ s: 'no_data', nextTime? }` when the range has no data
- 400 for missing/invalid parameters
  - Example: `{ "error": "Missing required parameter: symbol" }`
- 500 for internal server errors

## Performance & Caching

- Use `countback` to bound the number of returned bars
- Consider enabling `Cache-Control`/ETag for older date ranges to reduce load
- Recommended frontend options: `{ maxResponseLength: 1000, expectedOrder: 'latestFirst' }`

## Security & CORS

- If datafeed is hosted on a different origin than the web app, enable CORS accordingly
- If authentication is required, prefer co-origin hosting or a proxy, since UDF adapter is limited in adding custom headers
- Apply rate limiting if the API is public

## Testing (curl samples)

```
# Config
curl -s http://localhost:3002/api/tv/config | jq

# Symbols
curl -s "http://localhost:3002/api/tv/symbols?symbol=VIC" | jq

# Search
curl -s "http://localhost:3002/api/tv/search?query=VI&limit=5" | jq

# History (daily)
FROM=$(date -u -j -f %Y-%m-%d 2023-01-01 +%s)
TO=$(date -u -j -f %Y-%m-%d 2024-12-31 +%s)
curl -s "http://localhost:3002/api/tv/history?symbol=VIC&resolution=D&from=$FROM&to=$TO" | jq

# Week/month with countback
curl -s "http://localhost:3002/api/tv/history?symbol=VIC&resolution=W&countback=200" | jq

# Time
curl -s http://localhost:3002/api/tv/time

# Quotes
curl -s "http://localhost:3002/api/tv/quotes?symbols=VIC,VCB" | jq
```

## Limitations & Roadmap

- Intraday resolutions (1/5/15/30/60/120/240) are not available; adding them requires intraday or tick data storage
- Event marks and timescale marks currently return empty arrays; can be extended with corporate actions/news data
- Enhance per-symbol `pricescale`, `minmov`, `has_no_volume` based on exchange-specific rules

