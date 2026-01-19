/**
 * HTTP Header Fetcher
 * Fetches security headers from a given domain URL
 */

export interface FetchHeadersResult {
  success: boolean;
  headers: Record<string, string>;
  statusCode?: number;
  error?: string;
  url?: string;
  redirects?: string[];
}

/**
 * Fetches HTTP headers from a domain
 * Supports both HTTP and HTTPS, follows redirects
 */
export async function fetchSecurityHeaders(
  url: string,
  options: {
    timeout?: number;
    followRedirects?: boolean;
    maxRedirects?: number;
  } = {}
): Promise<FetchHeadersResult> {
  const {
    timeout = 10000,
    followRedirects = true,
    maxRedirects = 5,
  } = options;

  try {
    // Normalize URL
    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    const urlObj = new URL(normalizedUrl);
    const redirects: string[] = [];
    let currentUrl = normalizedUrl;
    let redirectCount = 0;

    // Fetch with HEAD request first (lighter), fallback to GET if needed
    while (redirectCount <= maxRedirects) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(currentUrl, {
          method: 'HEAD',
          redirect: followRedirects ? 'follow' : 'manual',
          signal: controller.signal,
          headers: {
            'User-Agent': 'ShieldCSP-Scanner/1.0',
          },
        });

        clearTimeout(timeoutId);

        // Handle redirects manually if needed
        if (response.status >= 300 && response.status < 400 && followRedirects) {
          const location = response.headers.get('location');
          if (location && redirectCount < maxRedirects) {
            redirects.push(currentUrl);
            currentUrl = new URL(location, currentUrl).toString();
            redirectCount++;
            continue;
          }
        }

        // Collect all headers
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });

        // If HEAD didn't work, try GET (some servers don't support HEAD)
        if (Object.keys(headers).length === 0) {
          const getResponse = await fetch(currentUrl, {
            method: 'GET',
            redirect: followRedirects ? 'follow' : 'manual',
            signal: controller.signal,
            headers: {
              'User-Agent': 'ShieldCSP-Scanner/1.0',
            },
          });

          getResponse.headers.forEach((value, key) => {
            headers[key] = value;
          });
        }

        return {
          success: true,
          headers,
          statusCode: response.status,
          url: currentUrl,
          redirects: redirects.length > 0 ? redirects : undefined,
        };
      } catch (fetchError: any) {
        // If HEAD fails, try GET
        if (fetchError.name === 'AbortError') {
          return {
            success: false,
            headers: {},
            error: `Request timeout after ${timeout}ms`,
            url: currentUrl,
          };
        }

        // Try GET as fallback
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const getResponse = await fetch(currentUrl, {
            method: 'GET',
            redirect: followRedirects ? 'follow' : 'manual',
            signal: controller.signal,
            headers: {
              'User-Agent': 'ShieldCSP-Scanner/1.0',
            },
          });

          clearTimeout(timeoutId);

          const headers: Record<string, string> = {};
          getResponse.headers.forEach((value, key) => {
            headers[key] = value;
          });

          return {
            success: true,
            headers,
            statusCode: getResponse.status,
            url: currentUrl,
            redirects: redirects.length > 0 ? redirects : undefined,
          };
        } catch (getError: any) {
          return {
            success: false,
            headers: {},
            error: getError.message || 'Failed to fetch headers',
            url: currentUrl,
          };
        }
      }
    }

    return {
      success: false,
      headers: {},
      error: `Too many redirects (max: ${maxRedirects})`,
      url: currentUrl,
      redirects,
    };
  } catch (error: any) {
    return {
      success: false,
      headers: {},
      error: error.message || 'Unknown error occurred',
    };
  }
}
