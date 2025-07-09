import { NextResponse } from 'next/server';

// Supported locales
const locales = ['en', 'de', 'ar'];
const defaultLocale = 'en';

// Determine preferred locale from Accept-Language header
function getPreferredLocale(request) {
  const acceptLang = request.headers.get('accept-language') || '';
  const preferred = acceptLang.split(',')[0]?.split('-')[0]?.toLowerCase();
  return locales.includes(preferred) ? preferred : defaultLocale;
}

// Helper function to get locale from pathname
function getLocale(pathname) {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  return locales.includes(potentialLocale) ? potentialLocale : null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // If accessing root, redirect to default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Check if pathname already has a valid locale
  const currentLocale = getLocale(pathname);

  // If no valid locale is found, redirect to preferred (or default) locale while preserving path & search
  if (!currentLocale) {
    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // If we have a valid locale, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|images|logos|videos|icons).*)',
  ],
}; 