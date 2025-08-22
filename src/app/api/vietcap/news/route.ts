import { NextRequest, NextResponse } from 'next/server';

// VietCap AI News API URL
const VIETCAP_NEWS_API_URL = 'https://ai.vietcap.com.vn/api/v2/news_info';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Build query parameters for VietCap API
    const queryParams = new URLSearchParams();
    
    // Add all supported parameters
    const page = searchParams.get('page');
    const ticker = searchParams.get('ticker');
    const pageSize = searchParams.get('page_size');
    const industry = searchParams.get('industry');
    const updateFrom = searchParams.get('update_from');
    const updateTo = searchParams.get('update_to');
    const sentiment = searchParams.get('sentiment');
    const newsFrom = searchParams.get('newsfrom');
    const language = searchParams.get('language');

    // Add parameters if they exist
    if (page) queryParams.append('page', page);
    if (ticker) queryParams.append('ticker', ticker);
    if (pageSize) queryParams.append('page_size', pageSize);
    if (industry) queryParams.append('industry', industry);
    if (updateFrom) queryParams.append('update_from', updateFrom);
    if (updateTo) queryParams.append('update_to', updateTo);
    if (sentiment) queryParams.append('sentiment', sentiment);
    if (newsFrom) queryParams.append('newsfrom', newsFrom);
    if (language) queryParams.append('language', language);

    // Construct the full URL
    const url = `${VIETCAP_NEWS_API_URL}?${queryParams.toString()}`;

    console.log('Proxying news info request to:', url);

    // Make the request to VietCap API with required headers
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://trading.vietcap.com.vn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error('VietCap News API error:', response.status, response.statusText);
      
      // Try to get error message from response
      let errorMessage = `VietCap News API error: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If we can't parse the error response, use the default message
      }

      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage,
          news_info: [],
          total_records: 0
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying news info request:', error);
    
    // Return error response in expected format
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error',
        news_info: [],
        total_records: 0
      },
      { status: 500 }
    );
  }
}
