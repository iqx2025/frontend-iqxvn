import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002';

export async function GET() {
  try {
    const backendUrl = `${API_BASE_URL}/api/tv/time`;
    const response = await fetch(backendUrl, { cache: 'no-store' });
    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    // Fallback: current server epoch seconds to keep TV polling happy
    const nowSec = Math.floor(Date.now() / 1000).toString();
    return new NextResponse(nowSec, { status: 200, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

