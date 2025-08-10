import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

function fallbackSymbolInfo(symbol: string) {
  // Minimal valid SymbolInfo per UDF spec
  return {
    name: symbol,
    ticker: symbol,
    description: symbol,
    type: 'index',
    session: '0900-1130,1300-1500',
    timezone: 'Asia/Ho_Chi_Minh',
    exchange: 'VN',
    minmov: 1,
    pricescale: 100,
    has_intraday: false,
    supported_resolutions: ['D', 'W', 'M'],
    has_no_volume: false,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || '').toUpperCase() || 'VNINDEX';
  try {
    const backendUrl = `${API_BASE_URL}/api/tv/symbols?symbol=${encodeURIComponent(symbol)}`;

    const response = await fetch(backendUrl, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
    if (!response.ok) {
      console.warn('Upstream /api/tv/symbols not OK, using fallback:', response.status);
      return NextResponse.json(fallbackSymbolInfo(symbol), { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Proxy /api/tv/symbols error, using fallback:', error);
    return NextResponse.json(fallbackSymbolInfo(symbol), { status: 200 });
  }
}

