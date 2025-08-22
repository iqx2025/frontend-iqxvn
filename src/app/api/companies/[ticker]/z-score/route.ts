import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    
    // Get the Z-Score API URL from environment variable
    const apiScoreUrl = process.env.API_SCORE_URL || 'http://0.0.0.0:8000';
    
    // Fetch Z-Score data from the backend API
    const response = await fetch(`${apiScoreUrl}/admin/sheet/z-score/${ticker.toUpperCase()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for real-time data
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Z-Score data not found for this ticker' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch Z-Score data: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Z-Score data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Z-Score data' },
      { status: 500 }
    );
  }
}
