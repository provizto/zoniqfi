// Daftar kode negara terlarang (US = Amerika Serikat, IR = Iran, KP = Korea Utara)
const BLOCKED_COUNTRIES = ['US', 'IR', 'KP'];

export function middleware(req) {
  // Mengambil data geolokasi langsung dari header bawaan Vercel
  const country = req.headers.get('x-vercel-ip-country');

  // Hanya blokir jika negara benar-benar terdeteksi dan ada di daftar blokir
  if (country && BLOCKED_COUNTRIES.includes(country)) {
    return new Response(
      JSON.stringify({
        error: "403 Forbidden",
        message: "Access denied. ZoniqFi protocol is unavailable in your jurisdiction due to regulatory restrictions."
      }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Konfigurasi matcher routing Vercel
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
};