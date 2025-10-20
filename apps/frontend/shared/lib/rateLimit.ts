const buckets = new Map<string, { tokens: number; updatedAt: number }>();

export async function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: limit, updatedAt: now };
  const elapsed = now - bucket.updatedAt;
  const refill = Math.floor((elapsed / windowMs) * limit);
  const tokens = Math.min(limit, bucket.tokens + (refill > 0 ? refill : 0));
  const ok = tokens > 0;
  buckets.set(key, { tokens: ok ? tokens - 1 : tokens, updatedAt: now });
  return { ok };
}

