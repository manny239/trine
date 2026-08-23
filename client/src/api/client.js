/**
 * The single entry point for every call the frontend makes to the API.
 * Paths are relative — the Vite dev server proxies `/api` to the Express server.
 */

const BASE = '/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
  } catch (cause) {
    // Network-level failure: server down, connection refused, request aborted.
    if (cause?.name === 'AbortError') throw cause;
    throw new Error('Could not reach the kitchen. Is the server running?');
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    // 502/503/504 come from the dev proxy when the API server is not running.
    if (!body && response.status >= 502) {
      throw new Error('Could not reach the kitchen. Is the server running?');
    }
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  return body;
}

/** Turn `{ category, q }` into a query string, dropping empty values. */
function toQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function getHealth(options) {
  return request('/health', options);
}

export function getMenu(params, options) {
  return request(`/menu${toQuery(params)}`, options);
}

export function getDish(idOrSlug, options) {
  return request(`/menu/${encodeURIComponent(idOrSlug)}`, options);
}

export function getCategories(options) {
  return request('/categories', options);
}

export function placeOrder(order, options) {
  return request('/orders', { method: 'POST', body: JSON.stringify(order), ...options });
}

export function getOrder(orderId, options) {
  return request(`/orders/${encodeURIComponent(orderId)}`, options);
}
