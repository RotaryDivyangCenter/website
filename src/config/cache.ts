type NextFetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
  };
};

const IS_DEV = process.env.NODE_ENV === 'development';

// Single source of truth for cache timings.
// Edit only these values to change cache behavior across gallery/stats flows.
const PROD_SERVERLESS_CACHE_SECONDS = 600; // 10 minutes
const PROD_BROWSER_CACHE_SECONDS = 300; // 5 minutes
const PROD_STALE_WHILE_REVALIDATE_SECONDS = 86400; // 24 hours

export const CACHE_CONFIG = {
  isDev: IS_DEV,
  serverlessSeconds: IS_DEV ? 0 : PROD_SERVERLESS_CACHE_SECONDS,
  browserSeconds: IS_DEV ? 0 : PROD_BROWSER_CACHE_SECONDS,
  staleWhileRevalidateSeconds: IS_DEV ? 0 : PROD_STALE_WHILE_REVALIDATE_SECONDS,
};

export const ROUTE_REVALIDATE_SECONDS = CACHE_CONFIG.serverlessSeconds;

export function getApiCacheHeaders(): Record<string, string> {
  if (CACHE_CONFIG.isDev) {
    return {
      'Cache-Control': 'no-store, max-age=0',
    };
  }

  return {
    'Cache-Control': `public, max-age=${CACHE_CONFIG.browserSeconds}, s-maxage=${CACHE_CONFIG.serverlessSeconds}, stale-while-revalidate=${CACHE_CONFIG.staleWhileRevalidateSeconds}`,
  };
}

export function getServerFetchOptions(): NextFetchOptions {
  if (CACHE_CONFIG.isDev) {
    return { cache: 'no-store' };
  }

  return {
    cache: 'force-cache',
    next: { revalidate: CACHE_CONFIG.serverlessSeconds },
  };
}
