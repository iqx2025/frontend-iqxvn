import { NextRequest, NextResponse } from 'next/server';

// VietCap AI News Detail API URL
const VIETCAP_NEWS_DETAIL_API_URL = 'https://ai.vietcap.com.vn/api/news_from_slug';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get required parameters
    const slug = searchParams.get('slug');
    const language = searchParams.get('language') || 'vi';

    // Validate required parameters
    if (!slug) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Slug parameter is required' 
        },
        { status: 400 }
      );
    }

    // Build query parameters for VietCap API
    const queryParams = new URLSearchParams();
    queryParams.append('slug', slug);
    queryParams.append('language', language);

    // Construct the full URL
    const url = `${VIETCAP_NEWS_DETAIL_API_URL}?${queryParams.toString()}`;

    console.log('Proxying news detail request to:', url);

    // Make the request to VietCap API with required headers
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://trading.vietcap.com.vn',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      // Cache for 10 minutes (news details don't change frequently)
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      console.error('VietCap News Detail API error:', response.status, response.statusText);
      
      // Try to get error message from response
      let errorMessage = `VietCap News Detail API error: ${response.status}`;
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
          message: errorMessage 
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error proxying news detail request:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
