const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10; // ~10 requests/minute

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Prune stale buckets once the map grows past this size, to avoid unbounded
// growth in long-running processes.
const PRUNE_THRESHOLD = 10_000;

function prune(now: number): void {
  if (buckets.size < PRUNE_THRESHOLD) return;
  for (const [ip, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(ip);
  }
}

/**
 * In-memory per-IP token bucket. Returns `true` if the request is allowed,
 * `false` if the caller should respond 429.
 */
export function check(ip: string): boolean {
  const now = Date.now();
  prune(now);

  let bucket = buckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(ip, bucket);
  }

  if (bucket.count >= MAX_REQUESTS) {
    return false;
  }

  bucket.count += 1;
  return true;
}
