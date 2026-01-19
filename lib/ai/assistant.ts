/**
 * AI Assistant Integration
 * Uses OpenAI to explain CSP issues, suggest remediations, and answer security questions.
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

export interface AiAssistantRequest {
  question: string
  context?: {
    cspPolicy?: string
    headers?: Record<string, string>
    violationsSummary?: string
  }
}

export interface AiAssistantResponse {
  answer: string
}

export async function askSecurityAssistant(
  payload: AiAssistantRequest,
): Promise<AiAssistantResponse> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      answer:
        "AI assistant is not configured yet. Please set the OPENAI_API_KEY environment variable to enable AI-powered CSP explanations and recommendations.",
    }
  }

  const systemPrompt = `
You are ShieldCSP, an expert Content Security Policy (CSP) and web security assistant.
Your job is to:
- Explain CSP issues in clear, concise language for senior engineers and security practitioners.
- Propose concrete CSP directives and header configurations to remediate issues.
- Reference OWASP and modern browser best practices.
- Be specific and actionable (include example policies, directives, and trade-offs).

When given context, respond using that context (CSP, headers, and violations summary).
Avoid hallucinating technologies that are not standard. Prefer practical, production-ready advice.
  `.trim()

  const userPromptParts = [`User question:\n${payload.question.trim()}`]

  if (payload.context?.cspPolicy) {
    userPromptParts.push(`\nCurrent CSP policy:\n${payload.context.cspPolicy}`)
  }
  if (payload.context?.headers) {
    userPromptParts.push(
      `\nRelevant security headers:\n${JSON.stringify(payload.context.headers, null, 2)}`,
    )
  }
  if (payload.context?.violationsSummary) {
    userPromptParts.push(
      `\nRecent CSP violations summary:\n${payload.context.violationsSummary}`,
    )
  }

  const userPrompt = userPromptParts.join("\n")

  const body = {
    model: "gpt-4.1-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    console.error("[AI Assistant] OpenAI error:", await response.text())
    return {
      answer:
        "The AI assistant could not process your request at this time. Please try again later.",
    }
  }

  const json = await response.json()
  const answer =
    json.choices?.[0]?.message?.content?.trim() ||
    "The AI assistant did not return a response."

  return { answer }
}

