/**
 * Cookie consent state + Microsoft Clarity loader.
 *
 * Privacy model (deliberate):
 *   • Clarity is NEVER loaded until the visitor accepts analytics cookies.
 *   • Consent is only persisted when the visitor accepts. Declining stores
 *     nothing, so no cookies are written and the consent card shows again on
 *     the next visit.
 *   • All storage access is guarded — private browsing or SSR (ssrSmoke) must
 *     never throw.
 */

const STORAGE_KEY = 'castui.cookie-consent';
const CLARITY_PROJECT_ID = 'xnuh32zwxp';

export type StoredConsent = {
  analytics: true;
  acceptedAt: string;
};

/** Returns the stored consent, or null if the visitor has not accepted. */
export function readConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    return parsed && parsed.analytics === true
      ? { analytics: true, acceptedAt: String(parsed.acceptedAt ?? '') }
      : null;
  } catch {
    return null;
  }
}

/** Persists acceptance. Only ever called when analytics consent is granted. */
export function saveConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    const consent: StoredConsent = {
      analytics: true,
      acceptedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage unavailable (private mode); Clarity still runs this session,
    // and the card will simply show again next visit.
  }
}

type ClarityFn = {
  (...args: unknown[]): void;
  q?: unknown[];
};

type ClarityWindow = Window & { clarity?: ClarityFn };

/**
 * Injects the Microsoft Clarity tag. TypeScript port of the official snippet.
 * Idempotent — safe to call more than once.
 */
export function loadClarity(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const w = window as ClarityWindow;
  if (w.clarity) return; // already queued or loaded

  const stub: ClarityFn = function (...args: unknown[]) {
    (stub.q = stub.q ?? []).push(args);
  };
  w.clarity = stub;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const first = document.getElementsByTagName('script')[0];
  if (first && first.parentNode) {
    first.parentNode.insertBefore(script, first);
  } else {
    document.head.appendChild(script);
  }
}
