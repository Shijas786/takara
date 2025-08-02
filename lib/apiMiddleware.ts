import { NextRequest, NextResponse } from 'next/server';
import { sanitizeResponse } from './sanitizeResponse';

/**
 * API Middleware - Automatically applies sanitizeResponse to all API responses
 * This prevents React element objects from being returned by any API route
 */
export function withSanitizer<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      const response = await handler(request, ...args);
      
      // If it's a JSON response, sanitize it
      if (response.headers.get('content-type')?.includes('application/json')) {
        const body = await response.json();
        const sanitizedBody = sanitizeResponse(body);
        
        return NextResponse.json(sanitizedBody, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      }
      
      // For non-JSON responses (like SVG), sanitize the body as string
      const body = await response.text();
      const sanitizedBody = sanitizeResponse(body);
      
      return new NextResponse(sanitizedBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      
    } catch (error) {
      console.error('API Middleware Error:', error);
      
      // If it's a sanitizer error, return a clear error message
      if (error instanceof Error && error.message.includes('React element object')) {
        return NextResponse.json(
          { 
            error: 'API attempted to return invalid data structure',
            details: 'React element objects are not allowed in API responses'
          },
          { status: 500 }
        );
      }
      
      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Helper function to create sanitized API responses
 */
export function createSanitizedResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(sanitizeResponse(data), { status });
}

/**
 * Helper function to create sanitized error responses
 */
export function createSanitizedErrorResponse(error: string, status: number = 500): NextResponse {
  return NextResponse.json(
    sanitizeResponse({ error }),
    { status }
  );
} 