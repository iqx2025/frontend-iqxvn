import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    
    // Get the F-Score API URL from environment variable (same as Z-Score)
    const apiScoreUrl = process.env.API_SCORE_URL || 'http://0.0.0.0:8000';
    
    // Fetch F-Score data from the backend API
    const response = await fetch(`${apiScoreUrl}/admin/sheet/f-score/${ticker.toUpperCase()}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Cache for 60 seconds
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'F-Score data not found for this ticker' },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch F-Score data: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching F-Score data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch F-Score data' },
      { status: 500 }
    );
  }
}
