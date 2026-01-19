import crypto from "crypto"
import { prisma } from "@/lib/prisma"

export interface GeneratedApiKey {
  id: string
  teamId: string
  key: string // plaintext key (only returned once)
  keyPrefix: string
  name?: string | null
  scopes?: string[]
  expiresAt?: Date | null
}

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex")
}

function generateKeyPrefix(): string {
  return crypto.randomBytes(4).toString("hex")
}

function generateRawKey(prefix: string): string {
  const randomPart = crypto.randomBytes(24).toString("hex")
  return `sk_shieldcsp_${prefix}_${randomPart}`
}

export async function generateApiKey(params: {
  teamId: string
  userId: string
  name?: string
  scopes?: string[]
  expiresAt?: Date | null
}): Promise<GeneratedApiKey> {
  const prefix = generateKeyPrefix()
  const rawKey = generateRawKey(prefix)
  const keyHash = hashKey(rawKey)

  const apiKey = await prisma.apiKey.create({
    data: {
      teamId: params.teamId,
      keyHash,
      keyPrefix: prefix,
      name: params.name,
      scopes: params.scopes ?? [],
      expiresAt: params.expiresAt ?? null,
      createdBy: params.userId,
    },
  })

  return {
    id: apiKey.id,
    teamId: apiKey.teamId,
    key: rawKey,
    keyPrefix: apiKey.keyPrefix,
    name: apiKey.name,
    scopes: (apiKey.scopes as string[]) ?? [],
    expiresAt: apiKey.expiresAt,
  }
}

export interface VerifiedApiKey {
  id: string
  teamId: string
  scopes: string[]
}

export async function verifyApiKey(rawKey: string, requiredScopes?: string[]): Promise<VerifiedApiKey | null> {
  if (!rawKey.startsWith("sk_shieldcsp_")) return null

  const keyHash = hashKey(rawKey)

  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
  })

  if (!apiKey) return null

  // Check expiration
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
    return null
  }

  const scopes = (apiKey.scopes as string[]) ?? []

  if (requiredScopes && requiredScopes.length > 0) {
    const hasAllScopes = requiredScopes.every((scope) => scopes.includes(scope))
    if (!hasAllScopes) return null
  }

  // Update last used timestamp (fire and forget)
  prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch((error) => {
      console.error("[verifyApiKey] Failed to update lastUsedAt", error)
    })

  return {
    id: apiKey.id,
    teamId: apiKey.teamId,
    scopes,
  }
}

