/**
 * Signup API Endpoint
 * Creates a new user account with hashed password
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { handleApiError } from "@/lib/errors"

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(12, "Password must be at least 12 characters"),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { email, name, password } = signupSchema.parse(json)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    // Create default team for the user
    const team = await prisma.team.create({
      data: {
        name: `${name}'s Team`,
        slug: `${email.split('@')[0]}-team`,
        ownerId: user.id,
        plan: "free",
      },
    })

    // Add user as team owner
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        role: "owner",
      },
    })

    return NextResponse.json(
      { 
        user,
        message: "Account created successfully. Please sign in." 
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request. Please check your input.", details: error.flatten() },
        { status: 400 }
      )
    }

    return handleApiError(error, {
      endpoint: '/api/auth/signup',
      method: 'POST',
      req,
    })
  }
}
