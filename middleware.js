import { NextResponse } from 'next/server';

// Helper function to remove 'interest-cohort' from Permissions-Policy header
function adjustPermissionsPolicy(response) {
  const policyHeader = response.headers.get('Permissions-Policy');
  if (policyHeader) {
    const directives = policyHeader.split(',').map(d => d.trim());
    // Filter out any directive that starts with 'interest-cohort'
    const filteredDirectives = directives.filter(directive =>
      !directive.toLowerCase().startsWith('interest-cohort')
    );
    const newPolicy = filteredDirectives.join(', ');

    if (newPolicy) {
      response.headers.set('Permissions-Policy', newPolicy);
    } else {
      // If the policy becomes empty, remove the header
      response.headers.delete('Permissions-Policy');
    }
  }
  
  return response;
}

// Middleware function that handles incoming requests
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // For static export, we need to handle API routes specially
  if (process.env.STATIC_EXPORT === 'true' && pathname.startsWith('/api/')) {
    // Redirect API routes to the backend
    const backendUrl = 'https://api.aimarker.tech';
    const apiUrl = new URL(pathname, backendUrl);
    
    // Copy all search parameters
    const searchParams = request.nextUrl.searchParams;
    searchParams.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });
    
    return NextResponse.rewrite(apiUrl);
  }
  
  // Add trailing slash for consistent routing, but not for API routes or static files
  if (!pathname.startsWith('/api/') && 
      !pathname.endsWith('/') &&
      !pathname.includes('.')) {
    const url = request.nextUrl.clone();
    url.pathname += '/';
    return adjustPermissionsPolicy(NextResponse.redirect(url));
  }

  return adjustPermissionsPolicy(NextResponse.next());
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};