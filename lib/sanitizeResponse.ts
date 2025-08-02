// lib/sanitizeResponse.ts
export function sanitizeResponse(obj: any): any {
  if (
    obj &&
    typeof obj === 'object' &&
    'type' in obj &&
    'props' in obj &&
    '$$typeof' in obj
  ) {
    // Block any object that has the React element $$typeof symbol
    throw new Error('API tried to return a React element object!');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeResponse);
  }
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      obj[key] = sanitizeResponse(obj[key]);
    }
  }
  return obj;
}