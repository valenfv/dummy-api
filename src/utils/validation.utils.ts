import type { ZodError } from 'zod'

export function formatZodErrorDetails(error: ZodError): Record<string, string> {
  const details: Record<string, string> = {}

  for (const issue of error.issues) {
    const segments = issue.path.filter((p: PropertyKey) => p !== undefined)
    const key =
      segments.length > 0 ? String(segments[segments.length - 1]) : 'root'

    if (details[key] !== undefined) continue

    const input = 'input' in issue ? issue.input : undefined
    const missingRequired =
      issue.code === 'invalid_type' && input === undefined

    details[key] = missingRequired ? 'This field is required' : issue.message
  }

  return details
}
