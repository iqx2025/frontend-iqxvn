import { NextRequest, NextResponse } from 'next/server';

/**
 * API route handler for fetching market leader stocks
 * Proxies requests to CafeF API to get stocks with most impact on market indices
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters with defaults
    const centerId = searchParams.get('centerId') || '1'; // Default to VNINDEX
    const take = searchParams.get('take') || '10';
    
    // Validate centerId
    const validCenterIds = ['1', '2', '9'];
    if (!validCenterIds.includes(centerId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid centerId. Must be 1 (VNINDEX), 2 (HNX), or 9 (UPCOM)'
        },
        { status: 400 }
      );
    }
    
    // Validate take parameter
    const takeNum = parseInt(take, 10);
    if (isNaN(takeNum) || takeNum < 1 || takeNum > 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid take parameter. Must be a number between 1 and 50'
        },
        { status: 400 }
      );
    }
    
    // Build the external API URL
    const apiUrl = `https://msh-appdata.cafef.vn/rest-api/api/v1/MarketLeaderGroup?centerId=${centerId}&take=${take}`;
    
    // Fetch data from external API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 60 seconds
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      data: data.data || [],
      exchange: centerId === '1' ? 'VNINDEX' : centerId === '2' ? 'HNX' : 'UPCOM',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Market Leaders API Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch market leaders',
        data: []
      },
      { status: 500 }
    );
  }
}
