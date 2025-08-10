import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

// Fallback per UDF spec when no data or backend unavailable
const NO_DATA = { s: 'no_data' } as const;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sp = url.searchParams;

    // Normalize resolution: accept 1D/1W/1M and map to D/W/M
    const rawRes = (sp.get('resolution') || '').toUpperCase();
    let normalizedRes = rawRes;
    if (/^1[ DWM]$/.test(` ${rawRes}`.replace(/\s+/g, ''))) {
      normalizedRes = rawRes.replace(/^1/, '');
    }
    if (['D', 'W', 'M'].includes(normalizedRes)) {
      sp.set('resolution', normalizedRes);
    }

    const backendUrl = `${API_BASE_URL}/api/tv/history?${sp.toString()}`;

    const response = await fetch(backendUrl, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });

    if (!response.ok) {
      console.warn('Upstream /api/tv/history not OK:', response.status);
      return NextResponse.json(NO_DATA, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Proxy /api/tv/history error, returning no_data:', error);
    return NextResponse.json(NO_DATA, { status: 200 });
  }
}

