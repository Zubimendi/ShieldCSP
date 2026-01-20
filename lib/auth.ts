/**
 * NextAuth v4 Configuration (App Router)
 */

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    // Credentials (email/password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl || undefined,
          }
        } catch (error) {
          // Log database errors but don't expose them to user
          const { logError } = await import('@/lib/logger')
          await logError('Authentication error', error, {
            endpoint: '/api/auth/[...nextauth]',
            method: 'POST',
            metadata: {
              email: credentials.email,
            },
          })
          
          // Return null to indicate authentication failure
          // NextAuth will show a generic error message
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // Force users to re-authenticate periodically
    // maxAge is in seconds – here: 12 hours
    maxAge: 12 * 60 * 60,
    // How often to update the session token while the user is active
    // (keeps active users logged in up to maxAge)
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login?error=AuthenticationError",
  },
  events: {
    async signIn({ user, isNewUser }) {
      // Log successful sign-in
      try {
        const { logInfo } = await import('@/lib/logger')
        await logInfo('User signed in', {
          endpoint: '/api/auth/[...nextauth]',
          method: 'POST',
          userId: user.id,
          metadata: { isNewUser },
        })
      } catch (error) {
        // Don't fail auth if logging fails
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.email = (user as any).email
        token.name = (user as any).name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // Ensure cookies work in production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
}
