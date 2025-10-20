type Level = 'info' | 'warn' | 'error';

function log(level: Level, event: string, meta?: Record<string, unknown>) {
  const payload = { ts: new Date().toISOString(), level, event, ...meta } as const;
  // eslint-disable-next-line no-console
  (console as any)[level === 'error' ? 'error' : level](JSON.stringify(payload));
}

export const structuredLog = {
  info: (e: string, m?: Record<string, unknown>) => log('info', e, m),
  warn: (e: string, m?: Record<string, unknown>) => log('warn', e, m),
  error: (e: string, m?: Record<string, unknown>) => log('error', e, m),
};

