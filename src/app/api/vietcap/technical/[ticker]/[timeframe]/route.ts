import { NextRequest, NextResponse } from 'next/server';

// VietCap API base URL
const VIETCAP_API_URL = 'https://iq.vietcap.com.vn/api/iq-insight-service/v1';

// Valid timeframes
const VALID_TIMEFRAMES = ['ONE_HOUR', 'ONE_DAY', 'ONE_WEEK'] as const;
type TechnicalTimeFrame = typeof VALID_TIMEFRAMES[number];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string; timeframe: string }> }
) {
  try {
    const { ticker, timeframe } = await params;

    // Validate timeframe
    if (!VALID_TIMEFRAMES.includes(timeframe as TechnicalTimeFrame)) {
      return NextResponse.json(
        { 
          successful: false, 
          msg: `Invalid timeframe. Must be one of: ${VALID_TIMEFRAMES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Construct the VietCap API URL
    const url = `${VIETCAP_API_URL}/company/${ticker.toUpperCase()}/technical/${timeframe}`;

    console.log('Proxying technical analysis request to:', url);

    // Make the request to VietCap API with required headers
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://trading.vietcap.com.vn',
        // Add any other headers that might be needed
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('VietCap API error:', response.status, response.statusText);
      
      // Try to get error message from response
      let errorMessage = `VietCap API error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.msg) {
          errorMessage = errorData.msg;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      return NextResponse.json(
        { 
          successful: false, 
          msg: errorMessage,
          status: response.status 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with proper structure
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying technical analysis request:', error);
    
    // Return error response in VietCap format
    return NextResponse.json(
      { 
        successful: false, 
        msg: error instanceof Error ? error.message : 'Internal server error',
        status: 500 
      },
      { status: 500 }
    );
  }
}
