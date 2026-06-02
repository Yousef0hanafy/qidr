import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = new TextEncoder().encode(
  process.env.ADMIN_PASSWORD || 'qidr-admin-secret-key-min-32-characters-long!'
)

const cookieName = 'qidr-admin-session'

interface SessionData {
  isLoggedIn: boolean
  exp: number
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ isLoggedIn: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey)

  const cookieStore = await cookies()
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return token
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(cookieName)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload as unknown as SessionData
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.isLoggedIn === true
}

export { cookieName }
