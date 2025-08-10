import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export async function GET(request: NextRequest) {
  try {
    const { search } = new URL(request.url);
    const backendUrl = `${API_BASE_URL}/api/tv/timescale_marks${search || ''}`;

    const response = await fetch(backendUrl, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy /api/tv/timescale_marks error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

