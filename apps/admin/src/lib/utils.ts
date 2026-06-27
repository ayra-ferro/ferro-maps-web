import type { Timestamp } from 'firebase/firestore'

export function formatRelativeTime(ts: Timestamp | null): string {
  if (!ts) return 'Unknown'
  const diffSec = Math.floor((Date.now() - ts.toMillis()) / 1000)
  if (diffSec < 60) return `Updated ${diffSec}s ago`
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `Updated ${diffMin} min ago`
  return `Updated ${Math.floor(diffMin / 60)}h ago`
}
