/**
 * XSS Test Execution Engine
 *
 * Simulates how a payload would behave under a given CSP and optional sanitizer.
 * NOTE: This runs on the server and does NOT execute untrusted code; it models outcomes.
 */

import DOMPurify from "isomorphic-dompurify"

export type SanitizerType = "none" | "dompurify" | "custom"

export interface XssTestInput {
  payload: string
  cspPolicy?: string | null
  sanitizer?: SanitizerType | string | null
  context?: string | null
}

export interface XssTestResult {
  wasBlocked: boolean
  executedSuccessfully: boolean
  sanitizedOutput?: string | null
  violationTriggered: boolean
  details: string[]
}

/**
 * Execute an XSS test in a safe, modeled way.
 */
export function executeXssTest(input: XssTestInput): XssTestResult {
  const { payload, cspPolicy, sanitizer = "none", context } = input
  const details: string[] = []

  let sanitizedOutput: string | null | undefined = payload
  let executedSuccessfully = false
  let violationTriggered = false
  let wasBlocked = false

  // 1) Apply sanitizer model
  if (sanitizer === "dompurify") {
    // Simulate DOMPurify sanitization in a safe way
    sanitizedOutput = DOMPurify.sanitize(payload, { USE_PROFILES: { html: true } })
    details.push("Sanitized payload using DOMPurify profile: html")
  } else if (sanitizer === "none" || !sanitizer) {
    details.push("No sanitizer applied")
  } else {
    // Custom sanitizer - we don't know exact behavior, so we just note it
    details.push(`Custom sanitizer hint provided: ${sanitizer}`)
  }

  // 2) Very rough CSP modeling
  const csp = cspPolicy || ""
  const hasStrictDynamic = csp.includes("strict-dynamic")
  const hasNonce = csp.includes("nonce-")
  const allowsUnsafeInline = csp.includes("unsafe-inline")

  if (!csp) {
    details.push("No CSP policy provided; payload would likely execute")
    executedSuccessfully = true
    violationTriggered = false
    wasBlocked = false
  } else {
    // If CSP explicitly disallows inline scripts AND we don't see unsafe-inline or proper nonce
    if (!allowsUnsafeInline && !hasNonce && csp.includes("script-src")) {
      details.push("CSP modeled as blocking inline scripts (no unsafe-inline / nonce present)")
      wasBlocked = true
      executedSuccessfully = false
      violationTriggered = true // would report a CSP violation
    } else if (allowsUnsafeInline) {
      details.push("CSP allows inline scripts via 'unsafe-inline'")
      executedSuccessfully = true
      violationTriggered = false
      wasBlocked = false
    } else if (hasNonce) {
      details.push("CSP uses nonces; execution depends on nonce wiring (modeled as blocked by default)")
      wasBlocked = true
      executedSuccessfully = false
      violationTriggered = true
    } else {
      details.push("CSP policy present but could not determine exact behavior; modeled as partially blocking")
      wasBlocked = true
      executedSuccessfully = false
      violationTriggered = true
    }
  }

  // 3) Context hint (html / attribute / js / url)
  if (context) {
    details.push(`Context hint: ${context}`)
  }

  return {
    wasBlocked,
    executedSuccessfully,
    sanitizedOutput,
    violationTriggered,
    details,
  }
}

