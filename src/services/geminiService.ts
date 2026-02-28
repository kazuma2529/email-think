import { Mode, Relationship, RewriteResult } from '../types';

export async function rewriteMessage(
  mode: Mode,
  draft: string,
  relationship: Relationship,
  receivedMessage?: string
): Promise<RewriteResult[]> {
  const response = await fetch('/api/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode,
      draft,
      relationship,
      receivedMessage,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `Failed to rewrite message: ${response.status}`);
  }

  return response.json();
}
