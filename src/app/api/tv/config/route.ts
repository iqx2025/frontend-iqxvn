import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

const fallbackConfig = {
  supports_search: true,
  supports_group_request: false,
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  exchanges: [{ value: '', name: 'All', desc: '' }],
  symbols_types: [{ name: 'All', value: '' }],
  supported_resolutions: ['D', 'W', 'M'],
};

export async function GET(request: NextRequest) {
  try {
    const { search } = new URL(request.url);
    const backendUrl = `${API_BASE_URL}/api/tv/config${search || ''}`;

    const response = await fetch(backendUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.warn('Upstream /api/tv/config not OK, using fallback config:', response.status);
      return NextResponse.json(fallbackConfig);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy /api/tv/config error, using fallback config:', error);
    return NextResponse.json(fallbackConfig);
  }
}

