import { NextRequest, NextResponse } from 'next/server';

// VietCap API base URL
const VIETCAP_API_URL = 'https://iq.vietcap.com.vn/api/iq-insight-service/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;

    // Construct the VietCap API URL for financial metrics
    const url = `${VIETCAP_API_URL}/company/${ticker.toUpperCase()}/financial-statement/metrics`;

    console.log('Proxying financial metrics request to:', url);

    // Make the request to VietCap API with required headers
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://trading.vietcap.com.vn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 10 minutes (financial data doesn't change that frequently)
      next: { revalidate: 600 },
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
    console.error('Error proxying financial metrics request:', error);
    
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
