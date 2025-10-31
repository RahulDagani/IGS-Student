// lib/auth.ts
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export interface AuthUser {
  userId: number;
  email: string;
  subdomain: string;
  companyName: string;
  iat?: number;
  exp?: number;
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Safely convert the payload to AuthUser
    const authUser: AuthUser = {
      userId: Number(payload.userId) || 0,
      email: String(payload.email || ''),
      subdomain: String(payload.subdomain || ''),
      companyName: String(payload.companyName || ''),
      iat: payload.iat ? Number(payload.iat) : undefined,
      exp: payload.exp ? Number(payload.exp) : undefined,
    };

    // Validate required fields
    if (!authUser.userId || !authUser.email || !authUser.subdomain || !authUser.companyName) {
      console.error('Invalid token payload: missing required fields');
      return null;
    }

    return authUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Alternative method with type guard
export async function verifyTokenWithGuard(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Type guard to check if payload matches AuthUser
    if (isAuthUserPayload(payload)) {
      return {
        userId: payload.userId,
        email: payload.email,
        subdomain: payload.subdomain,
        companyName: payload.companyName,
        iat: payload.iat,
        exp: payload.exp,
      };
    }
    
    console.error('Token payload does not match AuthUser interface');
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

// Type guard function
function isAuthUserPayload(payload: any): payload is AuthUser {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    typeof payload.userId === 'number' &&
    typeof payload.email === 'string' &&
    typeof payload.subdomain === 'string' &&
    typeof payload.companyName === 'string'
  );
}

// Method using unknown type casting (if you prefer)
export async function verifyTokenWithUnknown(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getTokenFromHeaders(headers: Headers): string | null {
  const authHeader = headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

// Helper to get user from request headers (from middleware)
export function getUserFromHeaders(headers: Headers): AuthUser | null {
  const userId = headers.get('x-user-id');
  const email = headers.get('x-user-email');
  const subdomain = headers.get('x-user-subdomain');
  const companyName = headers.get('x-user-company');

  if (!userId || !email || !subdomain || !companyName) {
    return null;
  }

  return {
    userId: parseInt(userId, 10),
    email,
    subdomain,
    companyName,
  };
}