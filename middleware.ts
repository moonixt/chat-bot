import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Configurar cabeçalhos CORS
  response.headers.set('Access-Control-Allow-Origin', '*'); // Ou defina origens específicas
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');

  return response;
}

// Aplicar apenas a rotas de API (ajuste conforme necessário)
export const config = {
  matcher: '/api/:path*',
};