export const ACCOUNT_APP_URL =
  import.meta.env.VITE_ACCOUNT_APP_URL || 'http://localhost:8081';

export const ACCOUNT_APP_DEEP_LINK =
  import.meta.env.VITE_ACCOUNT_APP_DEEP_LINK || 'neroproject://';

export const EXCHANGE_RATE_KEY = '@mbegu_capital_live_v1_rate';

export function getGlobalExchangeRate() {
  try {
    const saved = Number(localStorage.getItem(EXCHANGE_RATE_KEY));
    return saved > 0 ? saved : 2800;
  } catch {
    return 2800;
  }
}

export function getAppConnectionUrl() {
  try {
    const content = JSON.parse(localStorage.getItem('mbegu_public_site_content') || '{}');
    if (content.connectionAppUrl && content.connectionAppUrl.trim()) {
      return content.connectionAppUrl.trim();
    }
  } catch {
    // ignore
  }
  return ACCOUNT_APP_URL;
}

export function getAppDeepLink() {
  try {
    const content = JSON.parse(localStorage.getItem('mbegu_public_site_content') || '{}');
    if (content.connectionDeepLink && content.connectionDeepLink.trim()) {
      return content.connectionDeepLink.trim();
    }
  } catch {
    // ignore
  }
  return ACCOUNT_APP_DEEP_LINK;
}
